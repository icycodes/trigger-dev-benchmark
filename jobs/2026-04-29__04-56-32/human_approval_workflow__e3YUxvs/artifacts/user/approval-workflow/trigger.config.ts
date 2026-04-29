import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF as string,
  dirs: ["./src/trigger"],
  maxDuration: 3600,
});
