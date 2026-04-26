import { defineConfig } from "@trigger.dev/sdk/build";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF,
  dirs: ["./src/trigger"],
  maxDuration: 3600,
});