import { task, wait } from "@trigger.dev/sdk/v3";

// Trial ID is read at build time and embedded in the task ID
const trialId = "resilient_webhook_idempotency__2KjRTjz";

export const webhookHandlerTask = task({
  id: `webhook-handler-${trialId}`,
  run: async (payload: { idempotencyKey: string; amount: number }) => {
    // Simulate processing delay (2 seconds)
    await wait.for({ seconds: 2 });

    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
