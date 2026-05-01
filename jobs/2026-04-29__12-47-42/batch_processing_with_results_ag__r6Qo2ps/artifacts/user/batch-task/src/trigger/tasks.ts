import fs from "node:fs";
import { task, tasks } from "@trigger.dev/sdk/v3";

type ProcessItemPayload = {
  number: number;
};

type BatchProcessPayload = {
  numbers: number[];
};

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: ProcessItemPayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload.number * payload.number;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: BatchProcessPayload) => {
    const results = await tasks.batchTriggerAndWait<typeof processItemTask>(
      processItemTask.id,
      payload.numbers.map((number) => ({
        payload: { number },
      }))
    );

    return results.runs.reduce((total, run) => {
      if (!run.ok) {
        throw run.error;
      }

      return total + run.output;
    }, 0);
  },
});
