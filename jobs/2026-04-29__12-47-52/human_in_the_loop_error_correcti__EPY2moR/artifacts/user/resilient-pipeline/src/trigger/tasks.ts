import { client, triggerAndWait, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

// Read trial_id from /logs/trial_id
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

// Define the task ID suffix
const taskSuffix = trialId;

// Child task that simulates an unreliable operation
client.defineTask({
  id: `unreliable-task-${taskSuffix}`,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    const { input, shouldFail } = payload;

    if (shouldFail) {
      throw new Error(`Simulated failure: ${input}`);
    }

    return {
      result: `Processed: ${input}`,
    };
  },
});

// Parent task that implements resilient pipeline with human-in-the-loop error recovery
client.defineTask({
  id: `resilient-pipeline-${taskSuffix}`,
  run: async (payload: { input: string }) => {
    const { input } = payload;

    // Step 1: Try to process with unreliable task (will fail)
    try {
      await triggerAndWait(`unreliable-task-${taskSuffix}`, {
        input,
        shouldFail: true,
      });
    } catch (error) {
      // Expected failure - proceed to waitpoint
    }

    // Step 2: Create a waitpoint token for human intervention
    const token = await wait.createToken();

    // Step 3: Write the token ID to file for later retrieval
    const tokenFilePath = "/home/user/resilient-pipeline/waitpoint_token.txt";
    fs.writeFileSync(tokenFilePath, token.id, "utf-8");

    // Step 4: Pause execution and wait for token completion
    const completion = await wait.forToken(token.id);

    // Step 5: Retry with corrected input
    const result = await triggerAndWait(`unreliable-task-${taskSuffix}`, {
      input: completion.output.correctedInput,
      shouldFail: false,
    });

    // Step 6: Return the final result
    return result;
  },
});