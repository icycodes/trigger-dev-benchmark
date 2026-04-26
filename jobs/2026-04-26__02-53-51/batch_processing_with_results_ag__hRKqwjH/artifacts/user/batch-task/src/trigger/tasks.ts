import { task, batchTriggerAndWait } from "@trigger.dev/sdk";

const TRIAL_ID = "batch_processing_with_results_ag__hRKqwjH";

// Child task that processes an item (squares a number) with a small delay
export const processItemTask = task({
  id: `process-item-${TRIAL_ID}`,
  run: async (payload: { number: number }) => {
    // Simulate processing with a small delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return the square of the number
    return payload.number * payload.number;
  },
});

// Parent task that processes multiple items in parallel and aggregates results
export const batchProcessTask = task({
  id: `batch-process-${TRIAL_ID}`,
  run: async (payload: { numbers: number[] }) => {
    // Trigger all child tasks in parallel using batchTriggerAndWait
    const results = await batchTriggerAndWait(
      payload.numbers.map((number) => ({
        task: processItemTask,
        payload: { number },
      }))
    );

    // Aggregate results by summing all processed values
    const sum = results.reduce((total, result) => {
      if (result.ok) {
        return total + result.output;
      }
      return total;
    }, 0);

    return sum;
  },
});