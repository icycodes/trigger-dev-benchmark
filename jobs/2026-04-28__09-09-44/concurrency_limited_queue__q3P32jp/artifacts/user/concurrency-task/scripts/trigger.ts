import fs from "node:fs";
import { tasks } from "@trigger.dev/sdk/v3";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `exclusive-task-${trialId}`;

const run = async () => {
  const [run1, run2, run3] = await Promise.all([
    tasks.trigger(taskId, { id: "1" }),
    tasks.trigger(taskId, { id: "2" }),
    tasks.trigger(taskId, { id: "3" }),
  ]);

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
