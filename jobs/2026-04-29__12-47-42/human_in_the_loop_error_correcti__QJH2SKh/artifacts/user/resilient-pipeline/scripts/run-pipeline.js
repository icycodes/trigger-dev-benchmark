const { tasks } = require("@trigger.dev/sdk/v3");
const { readFileSync } = require("node:fs");

async function main() {
  const trialId = readFileSync("/logs/trial_id", "utf8").trim();
  const taskId = `resilient-pipeline-${trialId}`;
  const handle = await tasks.trigger(taskId, { input: "initial data" });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
