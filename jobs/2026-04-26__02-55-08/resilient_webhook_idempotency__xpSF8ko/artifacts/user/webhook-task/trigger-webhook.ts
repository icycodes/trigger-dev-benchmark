import { tasks } from "@trigger.dev/sdk/v3";
import type { webhookHandler } from "./src/trigger/webhook";

async function run() {
  const idempotencyKey = `key-${Date.now()}`;
  const amount = 100;

  console.log(`Triggering task twice with idempotencyKey: ${idempotencyKey}`);

  // Triggering the task twice in quick succession with the same idempotencyKey
  const [run1, run2] = await Promise.all([
    tasks.trigger<typeof webhookHandler>("webhook-handler-resilient_webhook_idempotency__xpSF8ko", 
      { idempotencyKey, amount }, 
      { idempotencyKey }
    ),
    tasks.trigger<typeof webhookHandler>("webhook-handler-resilient_webhook_idempotency__xpSF8ko", 
      { idempotencyKey, amount }, 
      { idempotencyKey }
    )
  ]);

  console.log(`Run 1 ID: ${run1.id}`);
  console.log(`Run 2 ID: ${run2.id}`);

  console.log("Waiting for runs to complete...");
  
  // In a real scenario, we might want to poll or wait for the results.
  // For the purpose of this script, we just print the IDs as requested.
}

run().catch(console.error);
