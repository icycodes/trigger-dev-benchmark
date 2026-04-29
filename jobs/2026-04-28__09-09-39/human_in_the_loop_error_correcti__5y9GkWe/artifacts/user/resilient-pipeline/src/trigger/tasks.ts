import { task, wait, triggerAndWait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

const trial_id = "human_in_the_loop_error_correcti__5y9GkWe";

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
    try {
      await triggerAndWait(unreliableTask, {
        input: payload.input,
        shouldFail: true,
      });
    } catch (error) {
      const token = await wait.createToken();
      const tokenFilePath = "/home/user/resilient-pipeline/waitpoint_token.txt";
      fs.writeFileSync(tokenFilePath, token.id);

      const completion = await wait.forToken(token);
      
      const correctedInput = (completion.output as { correctedInput: string }).correctedInput;

      const finalResult = await triggerAndWait(unreliableTask, {
        input: correctedInput,
        shouldFail: false,
      });

      return finalResult.output;
    }
  },
});
