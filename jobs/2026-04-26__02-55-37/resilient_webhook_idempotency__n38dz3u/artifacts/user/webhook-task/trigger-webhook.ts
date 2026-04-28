import { tasks } from "@trigger.dev/sdk/v3";
import { webhookHandler } from "./src/trigger/webhook";

async function main() {
  const idempotencyKey = "idempotent-key-" + Date.now();
  const payload = { amount: 100, idempotencyKey };

  console.log("Triggering 1st time...");
  const run1 = await tasks.trigger(webhookHandler.id, payload, {
    idempotencyKey,
  });
  console.log("Run 1 ID:", run1.id);

  console.log("Triggering 2nd time...");
  const run2 = await tasks.trigger(webhookHandler.id, payload, {
    idempotencyKey,
  });
  console.log("Run 2 ID:", run2.id);
}

main().catch(console.error);
