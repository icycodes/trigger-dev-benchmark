import { configure, tasks } from "@trigger.dev/sdk/v3";
import { readFileSync } from "fs";

// Configure using the secret key from environment
configure({
  baseURL: "https://api.trigger.dev",
  accessToken: process.env.TRIGGER_SECRET_KEY,
});

// Read trial_id to build the task ID
const trialId = readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `scheduled-sync-${trialId}`;

// Trigger the scheduled task immediately
const handle = await tasks.trigger(taskId, {});

console.log(`Run ID: ${handle.id}`);
