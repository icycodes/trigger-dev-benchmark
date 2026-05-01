import { configure, tasks } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

configure({
  secretKey: process.env.TRIGGER_SECRET_KEY,
});

async function main() {
  const taskId = `batch-process-${trialId}`;

  const handle = await tasks.trigger(taskId, { numbers: [1, 2, 3, 4, 5] });

  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
