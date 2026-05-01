import { client, task, batchTriggerAndWait } from "@trigger.dev/sdk";

// Initialize the client
client.init({
  id: "batch-processing-client",
});

// Read trial_id from /logs/trial_id
const trial_id = "batch_processing_with_results_ag__hbur3hR";

// Child task: process-item
// Takes a number, waits for 1 second, and returns the square of the number
export const processItemTask = task({
  id: `process-item-${trial_id}`,
  run: async (payload: { number: number }) => {
    // Simulate processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return the square of the number
    const result = payload.number * payload.number;
    return result;
  },
});

// Parent task: batch-process
// Takes an array of numbers, triggers process-item task for each in parallel,
// and returns the sum of all processed results
export const batchProcessTask = task({
  id: `batch-process-${trial_id}`,
  run: async (payload: { numbers: number[] }) => {
    // Trigger process-item task for each number in parallel
    const results = await batchTriggerAndWait(processItemTask, payload.numbers.map((number) => ({
      payload: { number },
    })));

    // Calculate the sum of all results
    const sum = results.reduce((acc, result) => acc + result.output, 0);
    
    return sum;
  },
});