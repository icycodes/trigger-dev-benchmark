import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF || "proj_rtgkjsjlpzzyxjsvxltt",
  dirs: ["./src/trigger"],
  maxDuration: 3600,
});