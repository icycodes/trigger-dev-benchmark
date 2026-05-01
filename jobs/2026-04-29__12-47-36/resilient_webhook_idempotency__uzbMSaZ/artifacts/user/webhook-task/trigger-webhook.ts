import { webhookHandler } from "./src/trigger/webhook.ts";

async function main() {
  const idempotencyKey = `webhook-${Date.now()}`;
  const amount = 100;

  console.log(`Triggering task twice with idempotencyKey: ${idempotencyKey}`);

  const run1 = await (webhookHandler as any).trigger({
    idempotencyKey,
    amount
  }, {
    idempotencyKey
  });

  const run2 = await (webhookHandler as any).trigger({
    idempotencyKey,
    amount
  }, {
    idempotencyKey
  });

  console.log(`Run ID 1:: ${run1.id}, Run ID 2: ${run2.id}`);
}

main();
