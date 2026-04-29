# Human Approval Workflow with Trigger.dev Waitpoints

## Background
Trigger.dev allows pausing a run until an external event occurs using **Waitpoints**. This is useful for human-in-the-loop approvals, where a workflow should only proceed after a manual check.

## Requirements
Implement a deployment approval workflow in a Trigger.dev task.
- The task should be named `deploy-approval-${trial_id}`.
- It should accept a payload with a `version` (string).
- It should create a waitpoint token using `wait.createToken()` with a timeout of 1 hour.
- It should write the waitpoint token URL to `/home/user/approval-workflow/approval_url.txt`.
- It should wait for the token using `wait.forToken()`.
- The token completion payload will be an object: `{ approved: boolean }`.
- If `approved` is true, the task should return `{ status: "deployed", version: payload.version }`.
- If `approved` is false, it should return `{ status: "rejected", version: payload.version }`.
- If the waitpoint times out (result not ok), it should throw an error or return a failure status.

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
    import { defineConfig } from "@trigger.dev/sdk/build";

    export default defineConfig({
      project: process.env.TRIGGER_PROJECT_REF,
      dirs: ["./src/trigger"],
      maxDuration: 3600,
    });
    ```
4. **Check Project Configuration** Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check `trigger.config.ts` file.

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`.
2. Create a Trigger.dev task in `src/trigger/approval.ts`.
3. Use `wait.createToken` and `wait.forToken` from `@trigger.dev/sdk`.
4. Use `fs.writeFileSync` to write the token URL to `/home/user/approval-workflow/approval_url.txt`.
5. Add an `npm run run-task` command in `package.json` that triggers the task with a version payload (e.g., `v1.0.0`) and prints the Run ID in the format `Run ID: ${run_id}`.

## Constraints
- Project path: `/home/user/approval-workflow`
- Task ID: `deploy-approval-${trial_id}`
- Suffix all task IDs with the `trial_id` found in `/logs/trial_id`.
- Use `@trigger.dev/sdk` for imports.

## Integrations
- Trigger.dev
