import { ffmpeg } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF || "proj_123",
  dirs: ["./src/trigger"],
  build: {
    extensions: [ffmpeg()],
  },
  maxDuration: 300,
});