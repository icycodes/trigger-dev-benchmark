import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: { number: number }) => {
    // Simulate processing with a 1 second delay
    await wait.for({ seconds: 1 });
    const result = payload.number * payload.number;
    return { result };
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: { numbers: number[] }) => {
    const { numbers } = payload;

    // Trigger all processItemTask instances in parallel and wait for all
    const results = await processItemTask.batchTriggerAndWait(
      numbers.map((number) => ({ payload: { number } }))
    );

    // Aggregate (sum) all results
    const sum = results.runs.reduce((acc, run) => {
      if (run.ok) {
        return acc + run.output.result;
      }
      return acc;
    }, 0);

    return { sum };
  },
});
