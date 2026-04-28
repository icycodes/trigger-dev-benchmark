import { ffmpeg } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF || "project-ref",
  dirs: ["./src/trigger"],
  maxDuration: 300,
  build: {
    extensions: [ffmpeg()],
  },
});
