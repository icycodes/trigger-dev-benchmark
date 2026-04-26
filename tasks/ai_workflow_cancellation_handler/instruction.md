# AI Workflow with Cancellation Handler

## Background
Trigger.dev is an open-source background jobs framework that allows developers to write reliable, long-running workflows. In AI workflows, it's common to have tasks that might take a long time (like generating content via an LLM) and may need to be cancelled if the user changes their mind or a timeout occurs. Handling cancellation gracefully via the `onCancel` hook is crucial to avoid orphaned processes or unnecessary API usage.

## Requirements
- Implement a Trigger.dev task named `ai-content-generator` (suffixed with `trial_id`).
- The task should simulate a long-running AI content generation process.
- Implement an `onCancel` hook that handles the cancellation of the task.
- Use an `AbortController` to signal cancellation to the simulated AI process.
- The task should write its status (e.g., 'started', 'cancelled', 'completed') to a JSON file at `/home/user/ai-workflow/status.json`.
- Provide an npm script `run-task` to trigger the task and print the `runId`.
- Provide an npm script `cancel-task` that takes a `runId` and cancels the task using the Trigger.dev CLI or SDK.

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
      // (Required) Your project ref from the Trigger.dev dashboard
      project: process.env.TRIGGER_PROJECT_REF,
      // (Required) Directories containing your tasks
      dirs: ["./src/trigger"],
      // (Required) Max duration of a task in seconds
      maxDuration: 3600,
      // (Optional) Retries config
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
2. Define the task in `src/trigger/ai-generator.ts`. The task ID must be `ai-content-generator-${trial_id}`.
3. Use `AbortController` inside the `run` function. Pass the `signal` to a simulated async function that waits for 20 seconds.
4. In the `onCancel` hook, log the cancellation and update `/home/user/ai-workflow/status.json` with `{"status": "cancelled"}`.
5. If the task completes without cancellation, update `/home/user/ai-workflow/status.json` with `{"status": "completed"}`.
6. Ensure `package.json` has:
   - `"run-task": "ts-node scripts/trigger.ts"` (triggers the task and prints `Run ID: <id>`)
   - `"cancel-task": "ts-node scripts/cancel.ts"` (cancels the task given a run ID)

## Constraints
- Project path: `/home/user/ai-workflow`
- Status file: `/home/user/ai-workflow/status.json`
- Trigger command: `npm run run-task`
- Cancel command: `npm run cancel-task -- <runId>`
- Must use `onCancel` lifecycle hook.
- Task ID must include `trial_id`.

## Integrations
- Trigger.dev
