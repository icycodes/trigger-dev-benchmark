const { tasks } = require("@trigger.dev/sdk/v3");

const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__wRzNnZZ";
const TASK_ID = `research-pipeline-${TRIAL_ID}`;

async function main() {
  const handle = await tasks.trigger(TASK_ID, {
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"],
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
