import { tasks } from "@trigger.dev/sdk/v3";
import type { exclusiveTask } from "../src/trigger/queue";

async function run() {
  const trialId = "concurrency_limited_queue__xVonVbT";
  const taskId = `exclusive-task-${trialId}`;

  const run1 = await tasks.trigger<typeof exclusiveTask>(taskId, { id: "1" });
  const run2 = await tasks.trigger<typeof exclusiveTask>(taskId, { id: "2" });
  const run3 = await tasks.trigger<typeof exclusiveTask>(taskId, { id: "3" });

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

run().catch(console.error);
