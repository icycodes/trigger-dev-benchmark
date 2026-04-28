import { batchTriggerAndWait, createTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const trialId = "batch_processing_with_results_ag__sVmG8gC";
const processItemTaskId = `process-item-${trialId}`;
const batchProcessTaskId = `batch-process-${trialId}`;

export const processItemTask = createTask({
  id: processItemTaskId,
  schema: z.number(),
  run: async (payload, { logger }) => {
    logger.info("Processing item", { payload });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return payload * payload;
  },
});

export const batchProcessTask = createTask({
  id: batchProcessTaskId,
  schema: z.array(z.number()),
  run: async (payload, { logger }) => {
    logger.info("Batch processing items", { count: payload.length });

    const batchResult = await batchTriggerAndWait(
      processItemTaskId,
      payload.map((value) => ({ payload: value }))
    );

    const outputs = batchResult.runs.map((run) => {
      if (!run.ok) {
        throw new Error(`process-item failed: ${String(run.error)}`);
      }

      return run.output;
    });

    return outputs.reduce((sum, value) => sum + value, 0);
  },
});
