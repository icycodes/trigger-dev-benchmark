import { task, wait } from "@trigger.dev/sdk";
import { writeFileSync } from "fs";

const trial_id = "human_in_the_loop_error_correcti__dBdSiJ4";

export const unreliableTask = task({
  id: `unreliable-task-${trial_id}`,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }
    return { result: `Processed: ${payload.input}` };
  },
});

export const resilientPipeline = task({
  id: `resilient-pipeline-${trial_id}`,
  run: async (payload: { input: string }) => {
    let correctedInput: string;

    try {
      console.log("Triggering unreliable task (should fail)");
      const result = await unreliableTask.triggerAndWait({
        input: payload.input,
        shouldFail: true,
      }, {
        retry: {
          maxAttempts: 0,
        }
      });
      
      if (!result.ok) {
        throw new Error(result.error instanceof Error ? result.error.message : String(result.error));
      }
      
      // This part should not be reached in the first call
      correctedInput = payload.input;
    } catch (error: any) {
      console.log(`Caught error: ${error.message}`);
      console.log("Creating token");
      const token = await wait.createToken();
      console.log(`Token created: ${token.id}`);
      writeFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", token.id);
      
      console.log("Waiting for token completion");
      const completion = await wait.forToken<{ correctedInput: string }>(token);
      console.log("Token completed, corrected input received");
      correctedInput = completion.output.correctedInput;
    }

    const finalResult = await unreliableTask.triggerAndWait({
      input: correctedInput,
      shouldFail: false,
    });

    return finalResult.output;
  },
});
