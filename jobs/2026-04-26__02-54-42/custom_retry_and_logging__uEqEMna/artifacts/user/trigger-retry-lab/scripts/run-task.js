const { readFileSync } = require("node:fs");
const { tasks } = require("@trigger.dev/sdk/v3");

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `retry-logic-task-${trialId}`;

async function run() {
  const handle = await tasks.trigger(taskId, { userId: "user_123" });
  console.log(`Run ID: ${handle.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
