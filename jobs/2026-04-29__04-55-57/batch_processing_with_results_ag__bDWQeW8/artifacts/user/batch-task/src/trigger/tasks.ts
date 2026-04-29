import { task } from "@trigger.dev/sdk/v3";

export const processItemTask = task({
  id: "process-item-batch_processing_with_results_ag__bDWQeW8",
  run: async (payload: { number: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload.number * payload.number;
  },
});

export const batchProcessTask = task({
  id: "batch-process-batch_processing_with_results_ag__bDWQeW8",
  run: async (payload: { numbers: number[] }) => {
    const results = await processItemTask.batchTriggerAndWait(
      payload.numbers.map((number) => ({ payload: { number } }))
    );

    let sum = 0;
    for (const result of results.runs) {
      if (result.ok) {
        sum += result.output;
      } else {
        throw new Error(`Task failed: ${result.error}`);
      }
    }

    return sum;
  },
});
