import { tasks } from "@trigger.dev/sdk";

const TRIAL_ID = "human_in_the_loop_error_correcti__wy5Yh9c";

async function main() {
  const result = await tasks.trigger(`resilient-pipeline-${TRIAL_ID}`, {
    input: "initial data",
  });
  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);
