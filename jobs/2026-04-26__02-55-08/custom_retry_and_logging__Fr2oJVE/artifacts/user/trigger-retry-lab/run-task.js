const { tasks, configure } = require("@trigger.dev/sdk/v3");

async function run() {
  const taskId = "retry-logic-task-custom_retry_and_logging__Fr2oJVE";
  const payload = { userId: "user_123" };
  const secretKey = process.env.TRIGGER_SECRET_KEY;

  if (!secretKey) {
    console.error("TRIGGER_SECRET_KEY is missing");
    process.exit(1);
  }

  configure({
    secretKey: secretKey,
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
