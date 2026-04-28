import { readFileSync } from "fs";
import { configure, tasks } from "@trigger.dev/sdk/v3";

const trialId = readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `scheduled-sync-${trialId}`;

// TRIGGER_SECRET_KEY is already set in the environment
const handle = await tasks.trigger(taskId, {});

console.log(`Run ID: ${handle.id}`);
