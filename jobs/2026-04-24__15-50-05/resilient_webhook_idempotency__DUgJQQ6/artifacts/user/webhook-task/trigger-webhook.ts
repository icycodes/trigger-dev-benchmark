import { tasks } from "@trigger.dev/sdk";

async function main() {
  const idempotencyKey = `idemp-${Date.now()}`;
  const payload = { idempotencyKey, amount: 100 };

  console.log(`Triggering tasks with idempotency key: ${idempotencyKey}`);

  // Trigger the task twice in quick succession
  const [run1, run2] = await Promise.all([
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__DUgJQQ6", payload, {
      idempotencyKey,
    }),
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__DUgJQQ6", payload, {
      idempotencyKey,
    }),
  ]);

  console.log("Run 1 ID:", run1.id);
  console.log("Run 2 ID:", run2.id);
}

main().catch(console.error);
