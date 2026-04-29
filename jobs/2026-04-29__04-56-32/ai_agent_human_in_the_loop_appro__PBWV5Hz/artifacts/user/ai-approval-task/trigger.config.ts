import { defineConfig } from "@trigger.dev/sdk";
import * as fs from "fs";

// Read trial_id at build time and inject as a deploy env var
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF!,
  dirs: ["./src/trigger"],
  maxDuration: 3600,
  deploy: {
    env: {
      TRIAL_ID: trialId,
    },
  },
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
