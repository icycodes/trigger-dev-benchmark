import { tasks } from "@trigger.dev/sdk/v3";
import { webhookHandlerTask } from "./src/trigger/webhook";

async function main() {
  const idempotencyKey = "test-payment-123";
  const amount = 100;

  console.log("Triggering webhook task twice with same idempotency key...");

  // Trigger the task twice with the same idempotency key
  const run1 = await tasks.trigger<typeof webhookHandlerTask>(webhookHandlerTask.id, {
    idempotencyKey,
    amount,
  }, {
    idempotencyKey,
  });

  console.log(`Run 1 triggered with ID: ${run1.id}`);

  const run2 = await tasks.trigger<typeof webhookHandlerTask>(webhookHandlerTask.id, {
    idempotencyKey,
    amount,
  }, {
    idempotencyKey,
  });

  console.log(`Run 2 triggered with ID: ${run2.id}`);

  console.log(`Run ID 1: ${run1.id}, Run ID 2: ${run2.id}`);
}

main().catch(console.error);