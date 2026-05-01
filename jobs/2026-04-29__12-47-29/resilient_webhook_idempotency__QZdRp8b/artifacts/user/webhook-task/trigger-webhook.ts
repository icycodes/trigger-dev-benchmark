import { tasks } from "@trigger.dev/sdk/v3";
import { randomUUID } from "crypto";

async function main() {
  const idempotencyKey = randomUUID();
  const payload = { amount: 100, idempotencyKey };

  console.log(`Triggering with idempotencyKey: ${idempotencyKey}`);

  // Trigger the task twice in quick succession with the same idempotency key
  const [run1, run2] = await Promise.all([
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__QZdRp8b", payload, {
      idempotencyKey,
    }),
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__QZdRp8b", payload, {
      idempotencyKey,
    }),
  ]);

  console.log("Run 1 ID:", run1.id);
  console.log("Run 2 ID:", run2.id);
  
  if (run1.id === run2.id) {
    console.log("Idempotency successful: both returned the same run ID");
  } else {
    console.log("Warning: different run IDs returned");
  }
}

main().catch(console.error);
