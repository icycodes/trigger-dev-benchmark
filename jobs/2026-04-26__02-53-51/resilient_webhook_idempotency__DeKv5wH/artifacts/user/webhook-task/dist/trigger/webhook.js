"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const sdk_1 = require("@trigger.dev/sdk");
sdk_1.client.define({
    name: "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
    id: "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
    apiKey: process.env.TRIGGER_API_KEY,
    trigger: {
        idempotencyKey: async (event) => {
            return event.idempotencyKey;
        },
    },
});
exports.webhookHandler = (0, sdk_1.task)({
    id: "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
    run: async (payload) => {
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
