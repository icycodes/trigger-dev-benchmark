import { task, tasks } from "@trigger.dev/sdk";

const trialId = "batch_processing_with_results_ag__L54dv2y";

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: number[]) => {
    const results = await tasks.batchTriggerAndWait(processItemTask.id, payload.map(item => ({ payload: item })));
    
    let sum = 0;
    for (const run of results.runs) {
      if (run.ok) {
        sum += run.output;
      }
    }
    return sum;
  },
});
