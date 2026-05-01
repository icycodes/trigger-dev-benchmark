import { ffmpeg } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF as string,
  maxDuration: 300,
  dirs: ["./src/trigger"],
  build: {
    extensions: [ffmpeg()],
  },
});
