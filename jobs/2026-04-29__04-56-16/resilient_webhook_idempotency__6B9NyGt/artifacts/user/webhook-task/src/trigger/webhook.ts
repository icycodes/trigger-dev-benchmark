import { task } from "@trigger.dev/sdk";

export interface WebhookPayload {
  idempotencyKey: string;
  amount: number;
}

const TRIAL_ID = "resilient_webhook_idempotency__6B9NyGt";

export const webhookHandler = task({
  id: `webhook-handler-${TRIAL_ID}`,
  run: async (payload: WebhookPayload) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
