import { tasks } from "@trigger.dev/sdk/v3";
import fs from "node:fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `multi-tenant-task-${trialId}`;

async function run() {
  const runs = await Promise.all([
    tasks.trigger(taskId, { userId: "user_A", jobId: "A1" }, { concurrencyKey: "user_A" }),
    tasks.trigger(taskId, { userId: "user_A", jobId: "A2" }, { concurrencyKey: "user_A" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B1" }, { concurrencyKey: "user_B" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B2" }, { concurrencyKey: "user_B" }),
  ]);

  const [runA1, runA2, runB1, runB2] = runs;

  console.log(`Run IDs: ${runA1.id}, ${runA2.id}, ${runB1.id}, ${runB2.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
