import { tasks } from "@trigger.dev/sdk/v3";
import type { webhookHandlerTask } from "./src/trigger/webhook";

const trialId = "resilient_webhook_idempotency__Nd3NVDV";
const taskId = `webhook-handler-${trialId}`;

async function main() {
  const idempotencyKey = `payment-${Date.now()}`;
  const payload = {
    idempotencyKey,
    amount: 99.99,
  };

  console.log(`Triggering task "${taskId}" twice with the same idempotency key: ${idempotencyKey}`);
  console.log("---");

  // Trigger the task twice in quick succession with the same idempotency key
  const [run1, run2] = await Promise.all([
    tasks.trigger<typeof webhookHandlerTask>(taskId, payload, {
      idempotencyKey,
    }),
    tasks.trigger<typeof webhookHandlerTask>(taskId, payload, {
      idempotencyKey,
    }),
  ]);

  console.log(`Run 1 ID: ${run1.id}`);
  console.log(`Run 2 ID: ${run2.id}`);
  console.log("---");

  if (run1.id === run2.id) {
    console.log(
      "✅ Idempotency confirmed: Both triggers returned the SAME Run ID."
    );
    console.log(
      "   Only one execution was created despite triggering twice with the same idempotency key."
    );
  } else {
    console.log(
      "⚠️  Different Run IDs returned. The idempotency window may have expired or the keys were treated differently."
    );
    console.log(`   Run 1: ${run1.id}`);
    console.log(`   Run 2: ${run2.id}`);
  }
}

main().catch((err) => {
  console.error("Error triggering webhook task:", err);
  process.exit(1);
});
