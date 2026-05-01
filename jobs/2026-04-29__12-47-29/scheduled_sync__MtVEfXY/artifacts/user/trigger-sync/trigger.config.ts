import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_rtgkjsjlpzzyxjsvxltt",
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
