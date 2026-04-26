import { tasks, configure } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "custom_retry_and_logging__RSxMie9";

async function main() {
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY,
    baseURL: "https://api.trigger.dev",
  });

  const handle = await tasks.trigger(`retry-logic-task-${TRIAL_ID}`, {
    userId: "user_123",
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
