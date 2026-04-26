import { tasks } from "@trigger.dev/sdk/v3";
import { batchProcessTask } from "./trigger/tasks";

async function runTask() {
  const handle = await tasks.trigger<typeof batchProcessTask>(
    batchProcessTask.id,
    [1, 2, 3, 4, 5]
  );

  console.log(`Run ID: ${handle.id}`);
}

runTask().catch((error) => {
  console.error("Failed to trigger batch-process", error);
  process.exit(1);
});
