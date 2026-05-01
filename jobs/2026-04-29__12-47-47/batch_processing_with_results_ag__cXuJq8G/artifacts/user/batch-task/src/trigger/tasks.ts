import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const processItemTask = task({
  id: `process-item-${trialId}`,
  maxDuration: 300,
  run: async (payload: { number: number }) => {
    // Simulate processing with a 1 second delay
    await wait.for({ seconds: 1 });
    const result = payload.number * payload.number;
    return { result };
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  maxDuration: 3600,
  run: async (payload: { numbers: number[] }) => {
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
