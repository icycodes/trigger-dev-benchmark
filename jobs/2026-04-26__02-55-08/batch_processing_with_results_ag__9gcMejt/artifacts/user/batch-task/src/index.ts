import { tasks } from "@trigger.dev/sdk";
import type { batchProcessTask } from "./trigger/tasks";

async function main() {
  const handle = await tasks.trigger<typeof batchProcessTask>(
    "batch-process-batch_processing_with_results_ag__9gcMejt",
    [1, 2, 3, 4, 5]
  );

  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
