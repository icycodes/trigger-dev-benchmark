const { client } = require("@trigger.dev/sdk");

async function runPipeline() {
  const TRIAL_ID = "human_in_the_loop_error_correcti__WrPBiaG";

  const run = await client.sendEvent({
    name: "resilient.pipeline",
    id: `resilient-pipeline-${TRIAL_ID}-${Date.now()}`,
    payload: {
      input: "initial data",
    },
  });

  console.log(`Run ID: ${run.id}`);
}

runPipeline().catch(console.error);