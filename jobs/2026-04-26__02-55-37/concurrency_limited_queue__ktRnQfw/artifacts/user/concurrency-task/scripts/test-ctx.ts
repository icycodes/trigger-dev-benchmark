import { tasks } from "@trigger.dev/sdk";
async function main() {
  const result = await tasks.triggerAndWait("exclusive-task-concurrency_limited_queue__ktRnQfw", { id: "test" });
  console.log(result);
}
main().catch(console.error);
