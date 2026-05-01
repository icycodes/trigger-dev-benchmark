import { readFileSync } from "node:fs";
import { logger, task, wait } from "@trigger.dev/sdk/v3";

type WebhookPayload = {
  idempotencyKey: string;
  amount: number;
};

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const webhookHandler = task({
  id: `webhook-handler-${trialId}`,
  run: async (payload: WebhookPayload) => {
    logger.info("Processing webhook payload", {
      idempotencyKey: payload.idempotencyKey,
      amount: payload.amount,
    });

    await wait.for({ seconds: 2 });

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
