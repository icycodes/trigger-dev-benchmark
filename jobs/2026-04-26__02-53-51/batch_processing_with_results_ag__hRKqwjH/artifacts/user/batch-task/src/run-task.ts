import { client } from "@trigger.dev/sdk";
import { batchProcessTask } from "./trigger/tasks";

async function main() {
  try {
    // Trigger the batchProcessTask with input [1, 2, 3, 4, 5]
    const run = await batchProcessTask.trigger({
      numbers: [1, 2, 3, 4, 5],
    });

    // Print the run_id
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main();