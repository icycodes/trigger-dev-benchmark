import { tasks } from "@trigger.dev/sdk";

async function main() {
  const idempotencyKey = `idemp-${Date.now()}`;
  const payload = { idempotencyKey, amount: 100 };
  
  const [handle1, handle2] = await Promise.all([
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__PFaoXBZ", payload, { idempotencyKey }),
    tasks.trigger("webhook-handler-resilient_webhook_idempotency__PFaoXBZ", payload, { idempotencyKey })
  ]);
  
  console.log(`Run ID 1:: ${handle1.id}, Run ID 2: ${handle2.id}`);
}

main().catch(console.error);
