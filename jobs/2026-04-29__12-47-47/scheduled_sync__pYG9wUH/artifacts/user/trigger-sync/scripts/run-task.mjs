import { configure, tasks } from "@trigger.dev/sdk/v3";
import { readFileSync } from "fs";

// Use TRIGGER_SECRET_KEY env var (project secret key)
const secretKey = process.env.TRIGGER_SECRET_KEY;
if (!secretKey) {
  console.error("TRIGGER_SECRET_KEY environment variable is not set");
  process.exit(1);
}

configure({
  secretKey,
});

// Read trial_id and build task ID
const trialId = readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `scheduled-sync-${trialId}`;

// Trigger the task immediately
const handle = await tasks.trigger(taskId, {});
console.log(`Run ID: ${handle.id}`);
