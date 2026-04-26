import { tasks } from "@trigger.dev/sdk";

async function main() {
  const trial_id = "concurrency_limited_queue__ktRnQfw";
  const taskId = `exclusive-task-${trial_id}`;

  const [res1, res2, res3] = await Promise.all([
    tasks.trigger(taskId, { id: "1" }),
    tasks.trigger(taskId, { id: "2" }),
    tasks.trigger(taskId, { id: "3" }),
  ]);

  console.log(`Run IDs: ${res1.id}, ${res2.id}, ${res3.id}`);
}

main().catch(console.error);
