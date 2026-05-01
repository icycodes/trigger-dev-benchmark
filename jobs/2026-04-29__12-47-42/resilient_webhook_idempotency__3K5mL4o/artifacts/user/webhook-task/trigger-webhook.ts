import { readFileSync } from "node:fs";
import { configure, tasks } from "@trigger.dev/sdk/v3";
import type { webhookHandler } from "./src/trigger/webhook.js";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `webhook-handler-${trialId}`;
const idempotencyKey = `payment-${trialId}-${Date.now()}`;

configure({ accessToken: process.env.TRIGGER_SECRET_KEY! });

const payload = {
  idempotencyKey,
  amount: 4200,
};

const [run1, run2] = await Promise.all([
  tasks.trigger<typeof webhookHandler>(taskId, payload, { idempotencyKey }),
  tasks.trigger<typeof webhookHandler>(taskId, payload, { idempotencyKey }),
]);

console.log(`Run ID 1:: ${run1.id}, Run ID 2: ${run2.id}`);
