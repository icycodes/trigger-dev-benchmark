import { schedules } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `scheduled-sync-${trialId}`;

async function main() {
  const handle = await schedules.trigger({
    taskIdentifier: taskId,
    timestamp: new Date(),
    timezone: "UTC",
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
