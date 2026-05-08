# Durable Subscription Onboarding with Waitpoints

## Background
In many SaaS applications, user onboarding involves steps that require human interaction, such as email verification or manual approval. Trigger.dev's **Waitpoints** allow you to pause a workflow indefinitely without consuming compute resources, and resume it once an external event (like a link click) occurs.

## Requirements
- Build a Next.js web application that handles user sign-up and onboarding.
- When a user signs up, trigger a Trigger.dev task named `onboarding-workflow-${trial_id}`.
- The task should:
    1. Set the run metadata to `{"status": "Waiting for verification"}`.
    2. Create a waitpoint token using `wait.createToken`.
    3. Pause execution using `wait.forToken` and wait for the token to be completed.
    4. Once completed, set the run metadata to `{"status": "Active"}`.
- The web app should:
    1. Provide a sign-up form (email input).
    2. Display the current status of the onboarding process by polling the Trigger.dev run status/metadata.
    3. Display a "Simulate Email Verification" link which, when clicked, completes the waitpoint token (you can do this via a server action or a simple API route in the web app that calls the Trigger.dev API).
- Use `trial_id` from `/logs/trial_id` to suffix the Trigger.dev task ID and isolate resources.

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

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`.
2. Create a Next.js project in `/home/user/onboarding-app`.
3. Implement the `onboarding-workflow-${trial_id}` task in `src/trigger/onboarding.ts`.
    - Use `runs.metadata.update` to set the status.
    - Use `wait.createToken({ timeout: "1h" })` to get a token.
    - Use `await wait.forToken(token)` to pause.
4. In the web app UI (`app/page.tsx`):
    - Show a form to start the onboarding.
    - Once started, show the Run ID and the current status (fetch from `https://api.trigger.dev/api/v3/runs/${runId}`).
    - If the status is "Waiting for verification", show a button/link that sends a POST request to `/api/verify?token=${tokenId}`.
5. Implement `app/api/verify/route.ts` to complete the token using `wait.completeToken(tokenId, { data: { verified: true } })` or by calling the Trigger.dev API directly.

## Constraints
- Project path: /home/user/onboarding-app
- Start command: `npm run dev` (Ensure it runs on port 3000)
- Port: 3000
- Use `trial_id` for task ID isolation.

## Integrations
- Trigger.dev
