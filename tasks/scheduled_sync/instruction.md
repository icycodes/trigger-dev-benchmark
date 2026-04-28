# Trigger.dev Scheduled Data Sync

## Background
Trigger.dev is a background job platform for TypeScript. One common use case is running periodic tasks (cron jobs) to synchronize data between external APIs and internal systems.

## Requirements
- Create a Trigger.dev task that performs a data synchronization.
- The task should be triggered on a schedule (e.g., every minute for this exercise).
- The task should fetch data from a mock external API (you can use a JSON placeholder or a simple mock function).
- The task should log the number of items processed.
- The task ID must be suffixed with the `trial_id` read from `/logs/trial_id`.

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
    ```
3.  **Create Project Configuration**: Create `trigger.config.ts` with the project ref from `TRIGGER_PROJECT_REF`.
    ```ts
    import { defineConfig } from "@trigger.dev/sdk";

    export default defineConfig({
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
    ```
4. **Check Project Configuration** Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check `trigger.config.ts` file.

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`.
2. Create a task in `src/trigger/sync.ts` using the `schedules.task` (or `task` with a schedule trigger).
3. Use `https://jsonplaceholder.typicode.com/todos` as the mock API to fetch data.
4. Log the count of todos fetched.
5. Ensure the task ID is `scheduled-sync-${trial_id}`.
6. Add an `npm run run-task` command in `package.json` that triggers the task immediately for testing, and prints the Run ID.

## Constraints
- Project path: /home/user/trigger-sync
- Start task: `npm run run-task`
- Task ID: `scheduled-sync-${trial_id}`

## Integrations
- Trigger.dev
