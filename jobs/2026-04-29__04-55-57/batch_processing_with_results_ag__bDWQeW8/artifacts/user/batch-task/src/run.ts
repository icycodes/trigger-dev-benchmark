import { batchProcessTask } from "./trigger/tasks";

async function run() {
  const run = await batchProcessTask.trigger({ numbers: [1, 2, 3, 4, 5] });
  console.log(`Run ID: ${run.id}`);
}

run().catch(console.error);
