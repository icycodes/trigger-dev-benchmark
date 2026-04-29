import { client, task } from "@trigger.dev/sdk/v3";

export const webhookHandlerTask = task({
  id: `webhook-handler-resilient_webhook_idempotency__7QZcEou`,
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});