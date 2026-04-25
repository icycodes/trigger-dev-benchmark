import { task } from "@trigger.dev/sdk";

export const webhookHandler = task({
  id: "webhook-handler-resilient_webhook_idempotency__DUgJQQ6",
  run: async (payload: { idempotencyKey: string; amount: number }, { ctx }) => {
    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
