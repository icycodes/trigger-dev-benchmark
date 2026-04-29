import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { task, tasks, wait } from "@trigger.dev/sdk/v3";

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
      return await tasks
        .triggerAndWait(unreliableTask.id, {
          input: payload.input,
          shouldFail: true,
        })
        .unwrap();
    } catch (error) {
      const token = await wait.createToken();
      await writeFile("/home/user/resilient-pipeline/waitpoint_token.txt", token.id, "utf8");

      const corrected = await wait.forToken<{ correctedInput: string }>(token).unwrap();

      return await tasks
        .triggerAndWait(unreliableTask.id, {
          input: corrected.correctedInput,
          shouldFail: false,
        })
        .unwrap();
    }
  },
});
