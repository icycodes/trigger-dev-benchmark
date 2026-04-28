import { task, wait } from "@trigger.dev/sdk";
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
    // Trigger child task with shouldFail: true (forced initial failure)
    try {
      await unreliableTask.triggerAndWait({
        input: payload.input,
        shouldFail: true,
      });
    } catch (err) {
      // Expected failure - proceed to human-in-the-loop correction
    }

    // Create a waitpoint token for human-in-the-loop correction
    const token = await wait.createToken();

    // Write the token ID to a file for external completion
    const tokenFilePath = path.join("/home/user/resilient-pipeline", "waitpoint_token.txt");
    fs.writeFileSync(tokenFilePath, token.id, "utf-8");

    // Pause execution until the token is completed
    const completion = await wait.forToken<{ correctedInput: string }>(token);

    if (!completion.ok) {
      const err = completion as { ok: false; error: Error };
      throw new Error(`Waitpoint failed: ${err.error.message}`);
    }

    const correctedInput = completion.output.correctedInput;

    // Trigger child task again with corrected input
    const finalResult = await unreliableTask.triggerAndWait({
      input: correctedInput,
      shouldFail: false,
    });

    if (!finalResult.ok) {
      throw new Error(`Final task failed`);
    }

    return finalResult.output;
  },
});
