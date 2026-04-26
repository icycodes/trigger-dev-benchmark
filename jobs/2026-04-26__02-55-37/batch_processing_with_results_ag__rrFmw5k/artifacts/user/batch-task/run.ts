import { batchProcessTask } from "./src/trigger/tasks";

async function main() {
  const handle = await batchProcessTask.trigger([1, 2, 3, 4, 5]);
  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
