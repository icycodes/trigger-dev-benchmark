# Video Processing with FFmpeg Extension

## Background
Trigger.dev allows you to use build extensions to install system-level dependencies like FFmpeg in your serverless environment. This task involves setting up a Trigger.dev project with the FFmpeg extension and creating a task that processes a video file.

## Requirements
- Initialize a Trigger.dev project in `/home/user/ffmpeg-task`.
- Configure the `ffmpeg` build extension in `trigger.config.ts`.
- Implement a Trigger.dev task named `ffmpeg-extract-audio-${trial_id}` (where `${trial_id}` is read from `/logs/trial_id`) that:
    - Accepts a `videoUrl` in its payload.
    - Downloads the video.
    - Uses `fluent-ffmpeg` to extract the audio and convert it to WAV format (mono, 44.1kHz).
    - Saves the resulting audio file to `/home/user/ffmpeg-task/output/audio.wav`.
- Create an `npm run run-task` command that triggers the task with a sample video URL and prints the Run ID.

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
    npm add fluent-ffmpeg node-fetch
    npm add -D @types/fluent-ffmpeg @types/node-fetch
    ```
3.  **Create Project Configuration**: Create `trigger.config.ts` with the project ref from `TRIGGER_PROJECT_REF` and add the `ffmpeg` extension.
    ```ts
    import { ffmpeg } from "@trigger.dev/build/extensions/core";
    import { defineConfig } from "@trigger.dev/sdk";

    export default defineConfig({
      project: process.env.TRIGGER_PROJECT_REF,
      dirs: ["./src/trigger"],
      build: {
        extensions: [ffmpeg()],
      },
    });
    ```
4. **Check Project Configuration** Use `npx tsc --skipLibCheck --noEmit trigger.config.ts` to type-check `trigger.config.ts` file.

## Implementation Guide
1. Read `trial_id` from `/logs/trial_id`.
2. Create the directory `/home/user/ffmpeg-task/output` and ensure it is writable.
3. Define the task in `src/trigger/ffmpeg-task.ts`. Use `fluent-ffmpeg` and `node-fetch` to process the video stream.
4. Ensure you use the `ffmpeg` extension in `trigger.config.ts` as shown in the setup guide.
5. Implement the `npm run run-task` script in `package.json` to trigger the task using `helloWorld.trigger()` (or equivalent for your task) and log `Run ID: <id>`.

## Constraints
- Project path: /home/user/ffmpeg-task
- Log file: /home/user/ffmpeg-task/output/audio.wav
- Start task: `npm run run-task`
- Use `trial_id` for the task ID suffix.
- Do not use external storage like S3/R2; save files locally to the `output` directory.

## Integrations
- Trigger.dev
