import { task, wait, tasks } from "@trigger.dev/sdk";
import * as fs from "fs";

const TRIAL_ID = "human_in_the_loop_error_correcti__wy5Yh9c";

export const unreliableTask = task({
  id: `unreliable-task-${TRIAL_ID}`,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }
    return { result: `Processed: ${payload.input}` };
  },
});

export const resilientPipeline = task({
  id: `resilient-pipeline-${TRIAL_ID}`,
  run: async (payload: { input: string }) => {
    try {
      await tasks.triggerAndWait(unreliableTask.id, {
        input: payload.input,
        shouldFail: true,
      }).unwrap();
    } catch (error) {
      // Create a waitpoint token
      const token = await wait.createToken();
      
      // Write the token ID to a file
      const tokenPath = "/home/user/resilient-pipeline/waitpoint_token.txt";
      fs.writeFileSync(tokenPath, token.id);
      
      // Pause execution waiting for the token
      const completion = await wait.forToken<{ correctedInput: string }>(token.id);
      
      if (!completion.ok) {
        throw new Error("Waitpoint failed");
      }

      // Trigger the child task again with the corrected input
      const finalResult = await tasks.triggerAndWait(unreliableTask.id, {
        input: completion.output.correctedInput,
        shouldFail: false,
      }).unwrap();
      
      return finalResult;
    }
  },
});
