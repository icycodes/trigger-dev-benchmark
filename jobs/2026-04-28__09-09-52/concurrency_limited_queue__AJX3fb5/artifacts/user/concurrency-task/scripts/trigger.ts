import { configure, tasks } from "@trigger.dev/sdk/v3";

// Configure the Trigger.dev client
configure({
  accessToken: process.env.TRIGGER_SECRET_KEY!,
});

async function main() {
  // Trigger 3 instances simultaneously
  const run1 = await tasks.trigger("exclusive-task-concurrency_limited_queue__AJX3fb5", { id: "1" });
  const run2 = await tasks.trigger("exclusive-task-concurrency_limited_queue__AJX3fb5", { id: "2" });
  const run3 = await tasks.trigger("exclusive-task-concurrency_limited_queue__AJX3fb5", { id: "3" });

  // Print the Run IDs
  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

main().catch(console.error);