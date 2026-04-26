import { task, wait } from "@trigger.dev/sdk";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: { number: number }): Promise<{ result: number }> => {
    // Simulate processing with a 1 second delay
    await wait.for({ seconds: 1 });
    return { result: payload.number * payload.number };
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: { numbers: number[] }): Promise<{ sum: number }> => {
    const items = payload.numbers.map((number) => ({
      payload: { number },
    }));

    const results = await processItemTask.batchTriggerAndWait(items);

    const sum = results.runs.reduce((acc, run) => {
      if (run.ok) {
        return acc + run.output.result;
      }
      return acc;
    }, 0);

    return { sum };
  },
});
