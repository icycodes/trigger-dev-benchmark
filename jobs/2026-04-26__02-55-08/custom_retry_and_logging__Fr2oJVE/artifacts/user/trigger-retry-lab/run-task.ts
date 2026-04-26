import { tasks, configure } from "@trigger.dev/sdk/v3";

async function run() {
  const taskId = "retry-logic-task-custom_retry_and_logging__Fr2oJVE";
  const payload = { userId: "user_123" };

  console.log("Using access token:", process.env.TRIGGER_ACCESS_TOKEN?.substring(0, 10) + "...");

  configure({
    secretKey: process.env.TRIGGER_ACCESS_TOKEN,
  });

  try {
    console.log(`Triggering task ${taskId}...`);
    const handle = await tasks.trigger(taskId, payload);
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

run();
