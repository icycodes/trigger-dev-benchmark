import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const unreliableTask = task({
  id: `unreliable-task-${trialId}`,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }
    return { result: `Processed: ${payload.input}` };
  },
});

export const resilientPipeline = task({
  id: `resilient-pipeline-${trialId}`,
  run: async (payload: { input: string }) => {
    // Trigger child task with shouldFail: true — expected to fail
    const firstRun = await unreliableTask.triggerAndWait({
      input: payload.input,
      shouldFail: true,
    });

    if (firstRun.ok) {
      // Unexpected success — shouldn't normally happen, but handle gracefully
      return firstRun.output;
    }

    // firstRun.ok === false: expected failure — proceed with human-in-the-loop correction

    // Create a waitpoint token for human intervention
    const token = await wait.createToken();

    // Write the token ID to file so the operator can complete it
    const tokenFilePath = path.join(
      "/home/user/resilient-pipeline",
      "waitpoint_token.txt"
    );
    fs.writeFileSync(tokenFilePath, token.id, "utf-8");

    // Pause execution until the token is completed
    const completion = await wait.forToken<{ correctedInput: string }>(token);

    if (!completion.ok) {
      throw new Error(`Waitpoint timed out or failed`);
    }

    // Retry child task with corrected input
    const secondRun = await unreliableTask.triggerAndWait({
      input: completion.output.correctedInput,
      shouldFail: false,
    });

    if (!secondRun.ok) {
      throw new Error(`Second run failed unexpectedly`);
    }

    return secondRun.output;
  },
});
