import { task, wait, batchTriggerAndWait } from "@trigger.dev/sdk";

const trialId = "batch_processing_with_results_ag__FYduC4P";

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: number) => {
    await wait("Wait for processing", 1);
    return payload * payload;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: number[]) => {
    const results = await batchTriggerAndWait(processItemTask, {
      items: payload.map((num) => ({ payload: num })),
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
