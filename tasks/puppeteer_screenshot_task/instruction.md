# Trigger.dev Puppeteer Screenshot Task

## Background
Trigger.dev is a powerful platform for running long-running background jobs. One common use case is automating browser tasks like taking screenshots of web pages. By using the Puppeteer build extension, you can run a full headless browser within your Trigger.dev tasks.

## Requirements
- Initialize a Trigger.dev project in `/home/user/screenshot-service`.
- Configure the project to use the Puppeteer build extension.
- Implement a task that takes a URL as input, uses Puppeteer to navigate to that URL, and takes a full-page screenshot.
- The task should save the screenshot to `/home/user/screenshot-service/screenshots/${url_slug}.png`.
- The task should return the path to the saved screenshot.
- Add an `npm run run-task` command to trigger the task with a sample URL (e.g., `https://example.com`) and print the `run_id`.

## Trigger.dev Project Setup Guide

**Note**: For more information, refer to the official [Trigger.dev manual setup documentation](https://trigger.dev/docs/manual-setup).

1.  **Configure CLI Credentials**: Before using the Trigger.dev CLI, create the configuration file with the provided credentials:
    ```bash
    mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
    ```
2.  **Initialize Project and Install Dependencies**: Set up a Node.js project and install the necessary Trigger.dev packages.
    ```bash
    npm init -y
    npm add @trigger.dev/sdk@latest puppeteer
    npm add -D @trigger.dev/build@latest typescript @types/node
    ```
3.  **Create Project Configuration**: Create `trigger.config.ts` with the project ref from `TRIGGER_PROJECT_REF` and include the Puppeteer extension.
    ```ts
    import { defineConfig } from "@trigger.dev/sdk";
    import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";

    export default defineConfig({
      project: process.env.TRIGGER_PROJECT_REF!,
      dirs: ["./src/trigger"],
      build: {
        extensions: [puppeteer()],
      },
    });
    ```
4. **Check Project Configuration** Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check `trigger.config.ts` file.

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`;
2. Create the task in `src/trigger/screenshot.ts`. Suffix the task ID with the `trial_id` (e.g., `id: "puppeteer-screenshot-${trial_id}"`);
3. Use `puppeteer.launch()` with the following options:
   ```javascript
   executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
   args: ["--no-sandbox", "--disable-setuid-sandbox"]
   ```
4. Implement the screenshot logic: navigate to the URL, take a full-page screenshot, and save it to the `screenshots` directory;
5. Ensure the `screenshots` directory exists before saving;
6. Add a script `trigger.ts` to trigger the task using `tasks.trigger` and print `Run ID: ${run.id}`;
7. Add `"run-task": "npx ts-node trigger.ts"` to `package.json` scripts.

## Constraints
- Project path: `/home/user/screenshot-service`
- Start task: `npm run run-task`
- The task ID must be `puppeteer-screenshot-${trial_id}`.
- Screenshots must be saved in `/home/user/screenshot-service/screenshots/`.

## Integrations
- Trigger.dev
