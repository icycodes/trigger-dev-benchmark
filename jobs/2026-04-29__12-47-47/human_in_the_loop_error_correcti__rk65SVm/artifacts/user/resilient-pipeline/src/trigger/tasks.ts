import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

// Read trial_id from /logs/trial_id
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

// Child task: unreliable-task-${trial_id}
export const unreliableTask = task({
  id: `unreliable-task-${trialId}`,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }
    return { result: `Processed: ${payload.input}` };
  },
});

// Parent task: resilient-pipeline-${trial_id}
export const resilientPipeline = task({
  id: `resilient-pipeline-${trialId}`,
  run: async (payload: { input: string }) => {
    // Step 1: Trigger child task with shouldFail: true (forcing an initial failure)
    try {
      await unreliableTask.triggerAndWait({
        input: payload.input,
        shouldFail: true,
      });
    } catch (_err) {
      // Expected failure — continue to human-in-the-loop correction
    }

    // Step 2: Create a waitpoint token for human-in-the-loop correction
    const token = await wait.createToken();

    // Step 3: Write the token ID to a file for the complete-waitpoint script
    const tokenFilePath = path.join(
      "/home/user/resilient-pipeline",
      "waitpoint_token.txt"
    );
    fs.writeFileSync(tokenFilePath, token.id, "utf-8");

    // Step 4: Pause execution and wait for the token to be completed with corrected input
    const completion = await wait.forToken<{ correctedInput: string }>(token);

    if (!completion.ok) {
      throw completion.error;
    }

    // Step 5: Trigger child task again with corrected input and shouldFail: false
    const finalResult = await unreliableTask.triggerAndWait({
      input: completion.output.correctedInput,
      shouldFail: false,
    });

    if (!finalResult.ok) {
      throw new Error(`Final task failed: ${String(finalResult.error)}`);
    }

    return finalResult.output;
  },
});
