import { tasks } from "@trigger.dev/sdk";

async function main() {
  const result = await tasks.trigger("retry-logic-task-custom_retry_and_logging__cSe89Fj", {
    userId: "user_123",
  });
  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);
