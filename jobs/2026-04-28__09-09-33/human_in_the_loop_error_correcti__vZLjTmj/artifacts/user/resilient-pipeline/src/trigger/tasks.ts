import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

export const unreliableTask = task({
  id: "unreliable-task-human_in_the_loop_error_correcti__vZLjTmj",
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }
    return { result: `Processed: ${payload.input}` };
  },
});

export const resilientPipeline = task({
  id: "resilient-pipeline-human_in_the_loop_error_correcti__vZLjTmj",
  run: async (payload: { input: string }) => {
    try {
      await unreliableTask.triggerAndWait({ input: payload.input, shouldFail: true }).unwrap();
    } catch (error) {
      const token = await wait.createToken();
      fs.writeFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", token.id);
      
      const completion = await wait.forToken<{ correctedInput: string }>(token.id).unwrap();
      
      const result = await unreliableTask.triggerAndWait({
        input: completion.correctedInput,
        shouldFail: false,
      }).unwrap();
      
      return result;
    }
  },
});
