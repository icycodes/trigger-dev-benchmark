import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // (Required) Your project ref from the Trigger.dev dashboard
  project: "proj_ldafqijxwfpazarsqbjm",
  // (Required) Directories containing your tasks
  dirs: ["./src/trigger"],
  // (Required) Max duration of a task in seconds
  maxDuration: 3600,
  // (Optional) Retries config
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
