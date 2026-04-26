const { tasks } = require("@trigger.dev/sdk/v3");

const TRIAL_ID = "human_in_the_loop_error_correcti__hSmEM5k";

async function main() {
  const result = await tasks.trigger(`resilient-pipeline-${TRIAL_ID}`, {
    input: "initial data",
  });

  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);