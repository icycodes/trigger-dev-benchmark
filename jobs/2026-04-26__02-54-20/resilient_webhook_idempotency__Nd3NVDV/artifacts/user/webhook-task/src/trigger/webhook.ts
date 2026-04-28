import { task, wait } from "@trigger.dev/sdk/v3";

const trialId = "resilient_webhook_idempotency__Nd3NVDV";

export interface WebhookPayload {
  idempotencyKey: string;
  amount: number;
}

export const webhookHandlerTask = task({
  id: `webhook-handler-${trialId}`,
  maxDuration: 300,
  run: async (payload: WebhookPayload) => {
    console.log(
      `Processing webhook with idempotencyKey: ${payload.idempotencyKey}, amount: ${payload.amount}`
    );

    // Simulated delay to represent work (2 seconds)
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
