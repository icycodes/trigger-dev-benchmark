import { task, logger } from "@trigger.dev/sdk";
import { readFileSync } from "node:fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const webhookTaskId = `webhook-handler-${trialId}`;

export type WebhookPayload = {
  idempotencyKey: string;
  amount: number;
};

export const webhookTask = task({
  id: webhookTaskId,
  run: async (payload: WebhookPayload) => {
    logger.info("Processing webhook", {
      idempotencyKey: payload.idempotencyKey,
      amount: payload.amount,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
