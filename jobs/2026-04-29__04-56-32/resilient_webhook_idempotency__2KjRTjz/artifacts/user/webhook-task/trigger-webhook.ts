import { tasks } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `webhook-handler-${trialId}`;

const idempotencyKey = `payment-${Date.now()}`;
const payload = { idempotencyKey, amount: 99.99 };

async function main() {
  const [run1, run2] = await Promise.all([
    tasks.trigger(taskId, payload, { idempotencyKey }),
    tasks.trigger(taskId, payload, { idempotencyKey }),
  ]);

  console.log(`Run ID 1: ${run1.id}, Run ID 2: ${run2.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
