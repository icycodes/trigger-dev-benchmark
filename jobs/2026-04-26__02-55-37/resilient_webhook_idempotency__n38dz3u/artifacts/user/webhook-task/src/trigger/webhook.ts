import { task } from "@trigger.dev/sdk/v3";

export const webhookHandler = task({
  id: "webhook-handler-resilient_webhook_idempotency__n38dz3u",
  run: async (payload: any) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      processedAt: new Date().toISOString(),
      amount: payload.amount,
    };
  },
});
