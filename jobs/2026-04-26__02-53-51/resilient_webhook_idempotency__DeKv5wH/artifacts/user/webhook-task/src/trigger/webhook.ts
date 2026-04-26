import { task } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    // Simulate processing work with a 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process the webhook (simulated)
    const result = {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };

    return result;
  },
});