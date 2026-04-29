# Trigger.dev Concurrency-Limited Task Queue

## Background
Trigger.dev allows you to control the concurrency of your tasks using Queues. This is essential when interacting with rate-limited APIs or resources with limited capacity. By defining a Queue with a `concurrencyLimit`, you can ensure that only a specific number of task instances run at the same time, regardless of how many are triggered.

## Requirements
- Initialize a Trigger.dev project in `/home/user/concurrency-task`.
- Define a Trigger.dev **Queue** with the ID `exclusive-queue-${trial_id}` and a `concurrencyLimit` of 1.
- Implement a task named `exclusive-task-${trial_id}` that:
    - Uses the defined queue.
    - Accepts a payload with an `id` (string).
    - Sleeps for 3 seconds to simulate work.
    - Returns the input `id` and the `startedAt` / `finishedAt` timestamps from the task context.
- Suffix all IDs (Queue ID and Task ID) with the `trial_id` read from `/logs/trial_id`.
- Add an `npm run run-task` command in `package.json` that triggers 3 instances of `exclusive-task-${trial_id}` simultaneously with IDs `"1"`, `"2"`, and `"3"`, and prints the 3 resulting Run IDs in the format `Run IDs: <id1>, <id2>, <id3>`.

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
2. In `src/trigger/queue.ts`, define the `Queue` and the `task`. Use the `queue` property in the `task` definition.
3. Use `await new Promise(resolve => setTimeout(resolve, 3000))` for the sleep.
4. Ensure the task is exported as a named export.
5. Implement a script `scripts/trigger.ts` that uses the Trigger.dev SDK to trigger the task 3 times and logs the Run IDs.

## Constraints
- Project path: /home/user/concurrency-task
- Start task: `npm run run-task`
- Queue Concurrency: 1
- Task ID: `exclusive-task-${trial_id}`
- Queue ID: `exclusive-queue-${trial_id}`

## Integrations
- Trigger.dev
