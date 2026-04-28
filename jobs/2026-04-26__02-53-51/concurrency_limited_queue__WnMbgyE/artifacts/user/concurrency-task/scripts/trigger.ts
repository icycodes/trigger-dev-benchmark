import { client } from "@trigger.dev/sdk";
import { exclusiveTask } from "../src/trigger/queue";

async function main() {
  // Trigger 3 instances of the task simultaneously
  const [run1, run2, run3] = await Promise.all([
    client.sendEvent({
      name: "exclusive-task-concurrency_limited_queue__WnMbgyE",
      payload: { id: "1" },
    }),
    client.sendEvent({
      name: "exclusive-task-concurrency_limited_queue__WnMbgyE",
      payload: { id: "2" },
    }),
    client.sendEvent({
      name: "exclusive-task-concurrency_limited_queue__WnMbgyE",
      payload: { id: "3" },
    }),
  ]);

  // Print the Run IDs in the required format
  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

main().catch(console.error);