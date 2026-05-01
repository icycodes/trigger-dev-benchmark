import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const [t1, t2, t3] = await Promise.all([
    tasks.trigger("exclusive-task-concurrency_limited_queue__r8736Wt", { id: "1" }),
    tasks.trigger("exclusive-task-concurrency_limited_queue__r8736Wt", { id: "2" }),
    tasks.trigger("exclusive-task-concurrency_limited_queue__r8736Wt", { id: "3" }),
  ]);

  console.log(`Run IDs: ${t1.id}, ${t2.id}, ${t3.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
