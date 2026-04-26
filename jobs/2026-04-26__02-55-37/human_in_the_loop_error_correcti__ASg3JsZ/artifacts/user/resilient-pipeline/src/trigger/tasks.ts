import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf8").trim();

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
      await unreliableTask.triggerAndWait({ input: payload.input, shouldFail: true });
    } catch (error) {
      const waitpoint = await wait.createToken();
      fs.writeFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", waitpoint.id);
      
      const completion = await wait.forToken<{ correctedInput: string }>(waitpoint.id);
      if (!completion.ok) {
         throw new Error("Waitpoint failed");
      }
      
      const finalResult = await unreliableTask.triggerAndWait({ 
        input: completion.output.correctedInput, 
        shouldFail: false 
      });
      
      return finalResult;
    }
  },
});
