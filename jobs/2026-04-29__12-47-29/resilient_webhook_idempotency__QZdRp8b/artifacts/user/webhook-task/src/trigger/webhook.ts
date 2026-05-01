import { task } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: "webhook-handler-resilient_webhook_idempotency__QZdRp8b",
  run: async (payload: { amount: number; idempotencyKey: string }) => {
    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return { 
      success: true, 
      processedAt: new Date().toISOString(), 
      amount: payload.amount 
    };
  },
});
