const { tasks } = require("@trigger.dev/sdk/v3");
const fs = require("node:fs");

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const resilientPipelineId = `resilient-pipeline-${trialId}`;

async function run() {
  const handle = await tasks.trigger(resilientPipelineId, {
    input: "initial data",
  });

  console.log(`Run ID: ${handle.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
