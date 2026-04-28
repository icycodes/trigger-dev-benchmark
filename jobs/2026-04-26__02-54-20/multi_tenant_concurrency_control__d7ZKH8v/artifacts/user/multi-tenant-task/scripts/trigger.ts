import { configure, tasks } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `multi-tenant-task-${trialId}`;

async function main() {
  configure({
    accessToken: process.env.TRIGGER_SECRET_KEY!,
  });

  const [runA1, runA2, runB1, runB2] = await Promise.all([
    tasks.trigger(taskId, { userId: "user_A", jobId: "A1" }, { concurrencyKey: "user_A" }),
    tasks.trigger(taskId, { userId: "user_A", jobId: "A2" }, { concurrencyKey: "user_A" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B1" }, { concurrencyKey: "user_B" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B2" }, { concurrencyKey: "user_B" }),
  ]);

  console.log(`Run IDs: ${runA1.id}, ${runA2.id}, ${runB1.id}, ${runB2.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
