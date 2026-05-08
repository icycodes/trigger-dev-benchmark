# Real-time Task Streaming Dashboard with Trigger.dev

## Background
Trigger.dev allows you to build long-running background tasks that can communicate their progress back to your application. In this task, you will build a Next.js dashboard that triggers a background task and displays its real-time progress using Trigger.dev's React hooks.

## Requirements
- Create a Next.js application in `/home/user/realtime-dashboard`.
- Set up Trigger.dev in the project (see the Setup Guide below).
- Implement a Trigger.dev task named `realtime-progress-task` (suffixed with `trial_id`) that:
    - Runs for approximately 10 seconds.
    - Updates its progress metadata every second (from 0% to 100%).
- Create a frontend page at `/` that:
    - Displays a "Start Task" button.
    - Uses the `@trigger.dev/react-hooks` hook `useRealtimeRun` to track the task's progress.
    - Displays a progress bar or text showing the current percentage.
    - Displays a "Task Completed!" message once the task finishes.

## Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
    npm add @trigger.dev/sdk@latest @trigger.dev/react-hooks@latest
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
2. Initialize a Next.js project in `/home/user/realtime-dashboard` using `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.
3. Install `@trigger.dev/sdk` and `@trigger.dev/react-hooks`.
4. Create a Trigger.dev task in `src/trigger/progress.ts`. The task ID must be `realtime-progress-task-${trial_id}`. Use `metadata.set("progress", { percentage: i * 10 })` in a loop to update progress.
5. Implement the frontend in `src/app/page.tsx`. Use `useRealtimeRun` to monitor the run. You will need to trigger the task from a Server Action or API route and pass the `runId` and `publicAccessToken` to the client component.
6. To trigger the task and get a token from a Server Action:
   ```ts
   const handle = await progressTask.trigger(payload);
   // handle.id and handle.publicAccessToken are available
   ```

## Constraints
- Project path: /home/user/realtime-dashboard
- Start command: `npm run dev`
- Port: 3000
- Task ID suffix: Must use `trial_id` from `/logs/trial_id`.

## Integrations
- Trigger.dev
