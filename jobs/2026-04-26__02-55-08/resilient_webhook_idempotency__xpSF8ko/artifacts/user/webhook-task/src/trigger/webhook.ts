import { task, wait } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: `webhook-handler-resilient_webhook_idempotency__xpSF8ko`,
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    console.log(`Processing webhook for amount: ${payload.amount} with idempotencyKey: ${payload.idempotencyKey}`);
    
    // Simulated delay to represent work
    await wait.for({ seconds: 2 });

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
