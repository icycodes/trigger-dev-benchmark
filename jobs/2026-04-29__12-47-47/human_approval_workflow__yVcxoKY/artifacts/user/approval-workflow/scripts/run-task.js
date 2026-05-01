const { tasks, configure } = require("@trigger.dev/sdk");
const fs = require("fs");

async function main() {
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `deploy-approval-${trialId}`;

  const handle = await tasks.trigger(taskId, { version: "v1.0.0" });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
