import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const handle = await tasks.trigger("batch-process-batch_processing_with_results_ag__FYduC4P", [1, 2, 3, 4, 5]);
  console.log(`Run ID: ${handle.id}`);
}

run().catch(console.error);
