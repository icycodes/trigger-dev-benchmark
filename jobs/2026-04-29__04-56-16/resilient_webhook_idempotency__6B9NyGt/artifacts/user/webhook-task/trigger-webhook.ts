import { webhookHandler, type WebhookPayload } from "./src/trigger/webhook";

const idempotencyKey = `payment-${Date.now()}`;
const payload: WebhookPayload = {
  idempotencyKey,
  amount: 4999,
};

const runTask = async () => {
  const run1 = await webhookHandler.trigger(payload, {
    idempotencyKey: payload.idempotencyKey,
  });

  const run2 = await webhookHandler.trigger(payload, {
    idempotencyKey: payload.idempotencyKey,
  });

  console.log(`Run ID 1:: ${run1.id}, Run ID 2: ${run2.id}`);
};

runTask().catch((error) => {
  console.error("Failed to trigger webhook task", error);
  process.exit(1);
});
