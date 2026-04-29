import { task, tasks } from "@trigger.dev/sdk/v3";

const trial_id = "batch_processing_with_results_ag__PqBXTTc";

export const processItemTask = task({
  id: `process-item-${trial_id}`,
  run: async (payload: { number: number }) => {
    // Simulate processing with a 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return the square of the number
    return payload.number * payload.number;
  },
});

export const batchProcessTask = task({
  id: `batch-process-${trial_id}`,
  run: async (payload: { numbers: number[] }) => {
    // Use batchTriggerAndWait to run processItemTask for each number in parallel
    const results = await tasks.batchTriggerAndWait(processItemTask, payload.numbers.map((number) => ({ number })));
    
    // Calculate the sum of all results
    const sum = results.reduce((acc, result) => acc + result.output, 0);
    
    return sum;
  },
});