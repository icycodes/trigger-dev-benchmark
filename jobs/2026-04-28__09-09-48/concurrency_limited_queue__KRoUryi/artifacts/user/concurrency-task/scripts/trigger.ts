import { tasks } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `exclusive-task-${trialId}`;

async function main() {
  const [run1, run2, run3] = await Promise.all([
    tasks.trigger(taskId, { id: "1" }),
    tasks.trigger(taskId, { id: "2" }),
    tasks.trigger(taskId, { id: "3" }),
  ]);

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
