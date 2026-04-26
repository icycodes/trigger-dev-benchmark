import { readFileSync } from "node:fs";
import { TriggerClient } from "@trigger.dev/sdk";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `exclusive-task-${trialId}`;

const client = new TriggerClient({
  id: "concurrency-task-client",
  apiKey: process.env.TRIGGER_API_KEY!,
});

const run = async (id: string) =>
  client.tasks.trigger(taskId, {
    payload: { id },
  });

const main = async () => {
  const [run1, run2, run3] = await Promise.all([
    run("1"),
    run("2"),
    run("3"),
  ]);

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
