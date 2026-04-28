import { tasks } from "@trigger.dev/sdk";

const trial_id = "multi_stage_ai_pipeline_orchestr__hDBM3jG";

async function main() {
  try {
    const run = await tasks.trigger(`research-pipeline-${trial_id}`, {
      topic: "Artificial Intelligence",
      languages: ["Spanish", "French", "German"]
    });
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

main();
