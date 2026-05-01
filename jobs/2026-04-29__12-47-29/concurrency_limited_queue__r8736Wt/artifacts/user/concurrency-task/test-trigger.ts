import { tasks } from "@trigger.dev/sdk/v3";
async function run() {
  const t1 = await tasks.trigger("exclusive-task-concurrency_limited_queue__r8736Wt", { id: "1" });
  console.log(t1.id);
}
