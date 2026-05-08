# Multi-tenant Concurrency Control with Trigger.dev

## Background
Trigger.dev allows you to control the concurrency of your tasks not just globally, but also per-tenant (e.g., per user or per organization). This is essential for SaaS applications where you want to ensure that one user's heavy workload doesn't block other users, while still limiting the resources consumed by any single user.

## Requirements
- Initialize a Trigger.dev project in `/home/user/multi-tenant-task`.
- Define a Trigger.dev **Queue** with the ID `multi-tenant-queue-${trial_id}` and a global `concurrencyLimit` of 10.
- Implement a task named `multi-tenant-task-${trial_id}` that:
    - Uses the defined queue.
    - Uses a `concurrencyKey` based on the `userId` in the payload to limit concurrency to **1 per user**.
    - Accepts a payload with `userId` (string) and `jobId` (string).
    - Simulates work by sleeping for 5 seconds.
    - Returns the `userId`, `jobId`, and the `startedAt` / `finishedAt` timestamps from the task context.
- Suffix all IDs (Queue ID and Task ID) with the `trial_id` read from `/logs/trial_id`.
- Add an `npm run run-task` command in `package.json` that triggers 4 task instances in parallel:
    - 2 instances for `user_A` (jobId: `A1`, `A2`)
    - 2 instances for `user_B` (jobId: `B1`, `B2`)
- The script should print the 4 resulting Run IDs in the format `Run IDs: <id_A1>, <id_A2>, <id_B1>, <id_B2>`.

## Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
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
2. In `src/trigger/multi_tenant.ts`, define the `Queue` with `concurrencyLimit: 10`.
3. Define the `task` and use the `queue` property. Use the `concurrencyKey` option in the task definition to return `payload.userId`.
4. Use `await new Promise(resolve => setTimeout(resolve, 5000))` for the sleep.
5. Implement a script `scripts/trigger.ts` that uses the Trigger.dev SDK to trigger the 4 tasks (A1, A2, B1, B2) and logs the Run IDs.

## Constraints
- Project path: /home/user/multi-tenant-task
- Start task: `npm run run-task`
- Task ID suffix: `${trial_id}`
- User Concurrency: 1 per user
- Total Concurrency: 10

## Integrations
- Trigger.dev
