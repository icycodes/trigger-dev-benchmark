# AI Agent with Human-in-the-Loop Approval

## Background
Trigger.dev is an open-source background jobs framework that allows developers to write reliable, long-running workflows. One of its powerful features is `wait.forToken()`, which enables human-in-the-loop patterns. In this task, you will build an AI content generation workflow that pauses for human approval before finalization.

## Requirements
- Initialize a Trigger.dev project in `/home/user/ai-approval-task`.
- Implement a task named `ai-content-generator-${trial_id}`.
- The task should:
  1. Simulate generating content (e.g., a blog post title and summary).
  2. Use `wait.forToken()` to pause execution and wait for a human approval.
  3. Once approved, return the content with an `approved: true` flag.
- Provide an npm script `npm run trigger-task` that triggers the task with a sample payload and prints the `run_id` and `waitpoint_token` to the console.
- Provide an npm script `npm run approve-task <token>` that completes the waitpoint using the provided token.

## Implementation Guide

### Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
    npm init -y
    npm add @trigger.dev/sdk@latest
    npm add -D @trigger.dev/build@latest typescript @types/node ts-node
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
4. **Check Project Configuration**: Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check the `trigger.config.ts` file.

### Task Implementation
1. Read `trial_id` from `/logs/trial_id`.
2. Create `src/trigger/ai-generator.ts` and define the task using `task` and `wait.forToken()`.
3. Suffix the task ID with `${trial_id}`.
4. Implement `npm run trigger-task` in `package.json` to trigger the task and output `Run ID: <run_id>` and `Token: <token>`.
5. Implement `npm run approve-task <token>` to complete the waitpoint using the Trigger.dev API or SDK.

## Constraints
- Project path: `/home/user/ai-approval-task`
- Trigger command: `npm run trigger-task`
- Approval command: `npm run approve-task <token>`
- Use `trial_id` to isolate task IDs.

## Integrations
- Trigger.dev
