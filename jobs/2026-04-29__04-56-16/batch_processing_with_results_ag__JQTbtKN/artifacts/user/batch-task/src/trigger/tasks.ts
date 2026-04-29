import { task, tasks } from "@trigger.dev/sdk/v3";

const trialId = "batch_processing_with_results_ag__JQTbtKN";

type ProcessItemPayload = {
  value: number;
};

type BatchProcessPayload = {
  values: number[];
};

export const processItemTask = task({
  id: `process-item-${trialId}`,
  run: async (payload: ProcessItemPayload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload.value * payload.value;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trialId}`,
  run: async (payload: BatchProcessPayload) => {
    const batchResult = await tasks.batchTriggerAndWait(
      processItemTask.id,
      payload.values.map((value) => ({
        payload: { value },
      }))
    );

    return batchResult.runs.reduce((total, run) => {
      if (!run.ok) {
        throw run.error;
      }

      return total + run.output;
    }, 0);
  },
});
