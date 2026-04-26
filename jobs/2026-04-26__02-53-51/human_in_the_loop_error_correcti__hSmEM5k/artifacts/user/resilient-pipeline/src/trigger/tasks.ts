import { task, tasks, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

const TRIAL_ID = "human_in_the_loop_error_correcti__hSmEM5k";

// Child task that can fail or succeed
export const unreliableTask = task({
  id: `unreliable-task-${TRIAL_ID}`,
  run: async ({ payload }: { payload: { input: string; shouldFail: boolean } }) => {
    const { input, shouldFail } = payload;

    if (shouldFail) {
      throw new Error(`Simulated failure: ${input}`);
    }

    return { result: `Processed: ${input}` };
  },
});

// Parent task with error recovery and waitpoint
export const resilientPipeline = task({
  id: `resilient-pipeline-${TRIAL_ID}`,
  run: async ({ payload }: { payload: { input: string } }) => {
    const { input } = payload;

    // First attempt - will fail
    try {
      await tasks.triggerAndWait(`unreliable-task-${TRIAL_ID}`, {
        input,
        shouldFail: true,
      });
    } catch (error) {
      // Expected failure - proceed to waitpoint
      console.log("Task failed as expected, creating waitpoint for manual correction");
    }

    // Create waitpoint token
    const token = await wait.createToken();

    // Write token ID to file
    const tokenFilePath = path.join(__dirname, "../../../waitpoint_token.txt");
    fs.writeFileSync(tokenFilePath, token.id, "utf-8");

    // Wait for token completion
    const completion = await wait.forToken<{ correctedInput: string }>(token);

    if (!completion.ok) {
      throw new Error("Waitpoint token failed or timed out");
    }

    // Retry with corrected input
    const result = await tasks.triggerAndWait(`unreliable-task-${TRIAL_ID}`, {
      input: completion.output.correctedInput,
      shouldFail: false,
    });

    return result;
  },
});