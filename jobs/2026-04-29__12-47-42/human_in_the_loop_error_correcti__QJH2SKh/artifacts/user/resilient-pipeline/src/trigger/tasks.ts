import { task, wait } from "@trigger.dev/sdk/v3";
import { readFileSync, writeFileSync } from "node:fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

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
    try {
      await unreliableTask.triggerAndWait({
        input: payload.input,
        shouldFail: true,
      }).unwrap();
    } catch (error) {
      const token = await wait.createToken();
      writeFileSync(
        "/home/user/resilient-pipeline/waitpoint_token.txt",
        token.id,
        "utf8"
      );

      const completion = await wait.forToken<{ correctedInput: string }>(token);

      if (!completion.ok) {
        throw completion.error;
      }

      const finalResult = await unreliableTask.triggerAndWait({
        input: completion.output.correctedInput,
        shouldFail: false,
      });

      if (!finalResult.ok) {
        throw finalResult.error;
      }

      return finalResult.output;
    }

    throw new Error("Unexpected success without waitpoint recovery.");
  },
});
