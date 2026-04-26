import { task, batchTriggerAndWait, wait } from "@trigger.dev/sdk";

export const processItemTask = task({
  id: "process-item-batch_processing_with_results_ag__9gcMejt",
  run: async (payload: number) => {
    await wait.for({ seconds: 1 });
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: "batch-process-batch_processing_with_results_ag__9gcMejt",
  run: async (payload: number[]) => {
    const results = await batchTriggerAndWait(processItemTask, {
      items: payload.map((item) => ({ payload: item })),
    });

    const sum = results.runs.reduce((acc, run) => {
      if (run.ok) {
        return acc + (run.output as number);
      }
      return acc;
    }, 0);

    return sum;
  },
});
