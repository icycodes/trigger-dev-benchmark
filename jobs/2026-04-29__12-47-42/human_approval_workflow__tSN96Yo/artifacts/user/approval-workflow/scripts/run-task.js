import fs from "fs";
import { TriggerClient } from "@trigger.dev/sdk";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `deploy-approval-${trialId}`;

const client = new TriggerClient({
  id: "approval-workflow",
  apiKey: process.env.TRIGGER_API_KEY,
});

const run = await client.trigger(taskId, {
  payload: {
    version: "v1.0.0",
  },
});

console.log(`Run ID: ${run.id}`);
