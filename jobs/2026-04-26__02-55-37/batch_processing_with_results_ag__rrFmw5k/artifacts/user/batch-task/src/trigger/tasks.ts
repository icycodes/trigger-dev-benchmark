import { task, tasks } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "batch_processing_with_results_ag__rrFmw5k";

export const processItemTask = task({
  id: `process-item-${TRIAL_ID}`,
  run: async (payload: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${TRIAL_ID}`,
  run: async (payload: number[]) => {
    const items = payload.map((num) => ({ payload: num }));
    const result = await tasks.batchTriggerAndWait(processItemTask.id, items);
    
    let sum = 0;
    for (const run of result.runs) {
      if (run.ok) {
        sum += run.output;
      }
    }
    return sum;
  },
});
