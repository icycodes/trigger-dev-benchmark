import { task, wait } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "resilient_webhook_idempotency__cd9uKxH";

export type WebhookPayload = {
  idempotencyKey: string;
  amount: number;
};

export const webhookHandlerTask = task({
  id: `webhook-handler-${TRIAL_ID}`,
  maxDuration: 300,
  run: async (payload: WebhookPayload) => {
    console.log(
      `Processing webhook with idempotency key: ${payload.idempotencyKey}`
    );
    console.log(`Payment amount: ${payload.amount}`);

    // Simulate work with a 2-second delay
    await wait.for({ seconds: 2 });

    const result = {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };

    console.log(`Webhook processed successfully:`, result);

    return result;
  },
});
