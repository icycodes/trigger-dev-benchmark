import { task } from "@trigger.dev/sdk/v3";

const trialId = "batch_processing_with_results_ag__XLLTEth";

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: number) => {
    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: number[]) => {
    // Trigger child tasks in parallel using batchTriggerAndWait
    const { runs } = await processItemTask.batchTriggerAndWait(
      payload.map((num) => ({
        payload: num,
      }))
    );

    // Sum the results
    let sum = 0;
    for (const run of runs) {
      if (run.ok) {
        sum += run.output;
      }
    }

    return sum;
  },
});
