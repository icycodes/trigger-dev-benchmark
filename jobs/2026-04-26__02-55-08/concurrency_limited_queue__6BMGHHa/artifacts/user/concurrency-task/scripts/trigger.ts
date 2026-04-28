import { tasks } from "@trigger.dev/sdk/v3";
import { exclusiveTask } from "../src/trigger/queue.js";

async function main() {
  const run1 = await tasks.trigger<typeof exclusiveTask>("exclusive-task-concurrency_limited_queue__6BMGHHa", { id: "1" });
  const run2 = await tasks.trigger<typeof exclusiveTask>("exclusive-task-concurrency_limited_queue__6BMGHHa", { id: "2" });
  const run3 = await tasks.trigger<typeof exclusiveTask>("exclusive-task-concurrency_limited_queue__6BMGHHa", { id: "3" });

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

main().catch(console.error);
