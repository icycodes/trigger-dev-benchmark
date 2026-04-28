"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const v3_1 = require("@trigger.dev/sdk/v3");
exports.webhookHandler = (0, v3_1.task)({
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
