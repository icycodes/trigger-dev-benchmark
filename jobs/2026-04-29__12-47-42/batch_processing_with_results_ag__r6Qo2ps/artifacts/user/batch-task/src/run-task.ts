import fs from "node:fs";
import { tasks } from "@trigger.dev/sdk/v3";
import type { batchProcessTask } from "./trigger/tasks";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

async function run() {
  const handle = await tasks.trigger<typeof batchProcessTask>(
    `batch-process-${trialId}`,
    {
      numbers: [1, 2, 3, 4, 5],
    }
  );

  console.log(`Run ID: ${handle.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
