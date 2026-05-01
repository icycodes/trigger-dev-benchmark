import { client } from "@trigger.dev/sdk";
import { batchProcessTask } from "./trigger/tasks";

// Initialize the client
client.init({
  id: "batch-processing-client",
});

// Trigger the batch-process task with input [1, 2, 3, 4, 5]
async function runTask() {
  console.log("Triggering batch-process task with input [1, 2, 3, 4, 5]...");
  
  const run = await batchProcessTask.trigger({
    numbers: [1, 2, 3, 4, 5],
  });

  console.log(`Run ID: ${run.id}`);
}

runTask().catch(console.error);