import { tasks, task, wait } from "@trigger.dev/sdk/v3";
import fs from "node:fs";
import { writeFile } from "node:fs/promises";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const unreliableTaskId = `unreliable-task-${trialId}`;
const resilientPipelineId = `resilient-pipeline-${trialId}`;

export const unreliableTask = task({
  id: unreliableTaskId,
  run: async (payload: { input: string; shouldFail: boolean }) => {
    if (payload.shouldFail) {
      throw new Error(`Simulated failure: ${payload.input}`);
    }

    return { result: `Processed: ${payload.input}` };
  },
});

export const resilientPipeline = task({
  id: resilientPipelineId,
  run: async (payload: { input: string }) => {
    try {
      const initialResult = await tasks
        .triggerAndWait(unreliableTaskId, {
          input: payload.input,
          shouldFail: true,
        })
        .unwrap();

      return initialResult;
    } catch (error) {
      const token = await wait.createToken();
      await writeFile(
        "/home/user/resilient-pipeline/waitpoint_token.txt",
        token.id,
        "utf8"
      );

      const completion = await wait
        .forToken<{ correctedInput: string }>(token)
        .unwrap();

      const finalResult = await tasks
        .triggerAndWait(unreliableTaskId, {
          input: completion.correctedInput,
          shouldFail: false,
        })
        .unwrap();

      return finalResult;
    }
  },
});
