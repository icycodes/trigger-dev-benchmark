# Resilient Webhook Handler with Idempotency

## Background
In distributed systems, webhooks can be delivered multiple times. Trigger.dev provides idempotency keys to ensure that a task is only executed once for a given unique identifier, even if triggered multiple times. This is critical for operations like payments or data synchronization.

## Requirements
- Implement a Trigger.dev task that simulates processing a webhook (e.g., a payment notification).
- The task must use an **idempotency key** provided in the payload to prevent duplicate processing.
- If the task is triggered multiple times with the same idempotency key, it should return the result of the first successful execution without running the logic again.
- The task should include a simulated delay (e.g., 2 seconds) to represent work.
- Implement a script to trigger this task twice in quick succession with the same idempotency key and verify that only one run is actually executed (or that both return the same successful result from the first run).
- Suffix the task ID with the `trial_id` from `/logs/trial_id` to avoid collisions.

## Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
    npm init -y
    npm add @trigger.dev/sdk@latest
    npm add -D @trigger.dev/build@latest typescript @types/node
    npx tsc --init
    ```
3.  **Create Project Configuration**: Create `trigger.config.ts` with the project ref from `TRIGGER_PROJECT_REF`.
    ```ts
    import { defineConfig } from "@trigger.dev/sdk";

    export default defineConfig({
      project: process.env.TRIGGER_PROJECT_REF!,
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
    ```
4. **Check Project Configuration** Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check `trigger.config.ts` file.

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`.
2. Create a task in `src/trigger/webhook.ts` with ID `webhook-handler-${trial_id}`.
3. The task should accept a payload with `idempotencyKey` and `amount`.
4. Use the `idempotencyKey` in the `trigger` call or define it within the task logic if using Trigger.dev's built-in idempotency features (Note: In v3/v4, idempotency is often handled at the trigger level via the `idempotencyKey` option).
5. The task should return `{ success: true, processedAt: new Date().toISOString(), amount: payload.amount }`.
6. Add a script `trigger-webhook.ts` that uses the Trigger.dev SDK to trigger the task twice with the same `idempotencyKey`.
7. Add an `npm run run-task` command in `package.json` that runs the `trigger-webhook.ts` script and prints the Run IDs.

## Constraints
- Project path: /home/user/webhook-task
- Start task: `npm run run-task`
- Task ID suffix: `${trial_id}`

## Integrations
- Trigger.dev
