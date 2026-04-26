import { client } from "@trigger.dev/sdk/v3";
import { retryLogicTask } from "./trigger/retry-task";

async function main() {
  const run_id = await retryLogicTask.trigger({
    userId: "user_123",
  });

  console.log(`Run ID: ${run_id}`);
}

main().catch(console.error);