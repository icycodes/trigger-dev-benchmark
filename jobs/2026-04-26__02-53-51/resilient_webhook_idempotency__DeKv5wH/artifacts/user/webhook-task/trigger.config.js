"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@trigger.dev/sdk");
exports.default = (0, sdk_1.defineConfig)({
    project: process.env.TRIGGER_PROJECT_REF,
    dirs: ["./src/trigger"],
    maxDuration: 3600,
    retries: {
        enabledInDev: true,
        default: {
            maxAttempts: 2,
            minTimeoutInMs: 1000,
            maxTimeoutInMs: 10000,
            factor: 2,
            randomize: true,
        },
    },
});
