import { task, wait } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: "webhook-handler-resilient_webhook_idempotency__tySjqkp",
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    console.log(`Processing webhook with idempotency key: ${payload.idempotencyKey}`);
    
    // Simulated delay
    await wait.for({ seconds: 2 });
    
    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
