import { task, wait, batch } from "@trigger.dev/sdk";

const trial_id = "batch_processing_with_results_ag__GGhd6kt";

export const processItemTask = task({
  id: `process-item-${trial_id}`,
  run: async (payload: number) => {
    await wait.for({ seconds: 1 });
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trial_id}`,
  run: async (payload: number[]) => {
    const results = await processItemTask.batchTriggerAndWait(
      payload.map((num) => ({ payload: num }))
    );

    const sum = results.runs.reduce((acc, run) => {
      if (run.ok) {
        return acc + (run.output as number);
      }
      return acc;
    }, 0);

    return sum;
  },
});
