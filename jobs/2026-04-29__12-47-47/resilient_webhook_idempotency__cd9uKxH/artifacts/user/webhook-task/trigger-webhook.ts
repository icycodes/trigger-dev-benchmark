import { runs, tasks } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import type { WebhookPayload } from "./src/trigger/webhook";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `webhook-handler-${trialId}`;

// A shared idempotency key — both triggers use the same key
const idempotencyKey = `payment-webhook-${trialId}-abc123`;

const payload: WebhookPayload = {
  idempotencyKey,
  amount: 9999,
};

async function main() {
  console.log(`Triggering task "${taskId}" twice with idempotency key: ${idempotencyKey}`);

  // Trigger both runs in quick succession using the same idempotency key
  const [run1, run2] = await Promise.all([
    tasks.trigger<typeof import("./src/trigger/webhook").webhookHandlerTask>(
      taskId,
      payload,
      { idempotencyKey }
    ),
    tasks.trigger<typeof import("./src/trigger/webhook").webhookHandlerTask>(
      taskId,
      payload,
      { idempotencyKey }
    ),
  ]);

  console.log(`Run ID 1:: ${run1.id}, Run ID 2: ${run2.id}`);
}

main().catch((err) => {
  console.error("Error triggering webhook task:", err);
  process.exit(1);
});
