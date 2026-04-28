import { TriggerClient } from "@trigger.dev/sdk";
import { readFileSync } from "node:fs";
import { webhookTaskId, WebhookPayload } from "./src/trigger/webhook";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const client = new TriggerClient({
  id: `webhook-trigger-${trialId}`,
  apiKey: process.env.TRIGGER_API_KEY!,
});

const payload: WebhookPayload = {
  idempotencyKey: `payment-${trialId}-${Date.now()}`,
  amount: 4200,
};

const run = async () => {
  const firstRun = await client.trigger(webhookTaskId, payload, {
    idempotencyKey: payload.idempotencyKey,
  });
  const secondRun = await client.trigger(webhookTaskId, payload, {
    idempotencyKey: payload.idempotencyKey,
  });

  console.log("First run ID:", firstRun.id);
  console.log("Second run ID:", secondRun.id);
  console.log(
    "Both runs use idempotency key:",
    payload.idempotencyKey,
    "(should resolve to the same execution)"
  );
};

run().catch((error) => {
  console.error("Failed to trigger webhook task", error);
  process.exit(1);
});
