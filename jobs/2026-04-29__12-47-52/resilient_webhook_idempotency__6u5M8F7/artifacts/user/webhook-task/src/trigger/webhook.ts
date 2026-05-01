import { task } from "@trigger.dev/sdk/v3";

interface WebhookPayload {
  idempotencyKey: string;
  amount: number;
}

export const webhookHandler = task({
  id: `webhook-handler-resilient_webhook_idempotency__6u5M8F7`,
  run: async (payload: WebhookPayload) => {
    console.log(`Processing webhook with idempotencyKey: ${payload.idempotencyKey}`);
    
    // Simulate work with a 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process the webhook (simulated - e.g., payment notification)
    console.log(`Processing payment of amount: ${payload.amount}`);
    
    // Return the result
    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});