import { task, wait } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: `webhook-handler-resilient_webhook_idempotency__uzbMSaZ`,
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    console.log(`Processing webhook with idempotencyKey: ${payload.idempotencyKey}, amount: ${payload.amount}`);
    
    // Simulated delay of 2 seconds
    await wait.for({ seconds: 2 });
    
    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
      idempotencyKey: payload.idempotencyKey
    };
  },
});
