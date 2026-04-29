import { tasks } from "@trigger.dev/sdk/v3";
import { batchProcessTask } from "./trigger/tasks";

async function main() {
  const run = await tasks.trigger(batchProcessTask, {
    numbers: [1, 2, 3, 4, 5],
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);