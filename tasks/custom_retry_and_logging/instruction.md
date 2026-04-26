# Trigger.dev Custom Retry and Logging

## Background
Trigger.dev is a platform for building long-running background jobs in TypeScript. It provides built-in observability and powerful retry mechanisms. In this task, you will implement a task that uses custom retry logic and advanced logging to track task attempts.

## Requirements
- Initialize a Trigger.dev project in `/home/user/trigger-retry-lab`.
- Create a task named `retry-logic-task` in `src/trigger/retry-task.ts`.
- The task should accept a payload with a `userId` (string).
- Implement custom retry logic:
    - `maxAttempts`: 4
    - `minTimeoutInMs`: 2000
    - `maxTimeoutInMs`: 10000
    - `factor`: 2
- In the `run` function:
    - Use `logger.info` to log the current attempt number (available in `ctx.run.attempt.number`). Format: `"Attempt number: ${ctx.run.attempt.number}"`.
    - Simulate a transient failure: throw an error on the first 2 attempts. The error message should be `"Transient failure on attempt ${ctx.run.attempt.number}"`.
    - On the 3rd attempt, succeed and return an object: `{ status: "success", userId: payload.userId, attempt: ctx.run.attempt.number }`.
- Add an `npm run run-task` command in `package.json` that triggers the task with `userId: "user_123"` and prints the run_id with format `Run ID: ${run_id}`.

## Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
    npm add @trigger.dev/sdk@latest
    npm add -D @trigger.dev/build@latest
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

## Awareness of Parallel Trials Running

Be aware that multiple trials for one task may run concurrently against the same Trigger.dev project referenced by `TRIGGER_PROJECT_REF`. To avoid collisions, you must use `trial_id` to isolate each trial's resources.

In the task running environment, there is a `trial_id` saved in the `/logs/trial_id` text file.

Whenever you create a Trigger.dev task, suffix the task ID with the `trial_id`.

## Constraints
- Project path: /home/user/trigger-retry-lab
- Start task: `npm run run-task`
- Use `trial_id` from `/logs/trial_id` as a suffix for the task ID (e.g., `retry-logic-task-${trial_id}`).

## Integrations
- Trigger.dev
