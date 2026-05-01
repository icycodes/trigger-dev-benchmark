import fs from "node:fs";
import { tasks } from "@trigger.dev/sdk/v3";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `scheduled-sync-${trialId}`;

const payload = {
  type: "IMPERATIVE",
  timestamp: new Date(),
  timezone: "UTC",
  scheduleId: "manual",
  upcoming: [],
};

const handle = await tasks.trigger(taskId, payload);

console.log(`Run ID: ${handle.id}`);
