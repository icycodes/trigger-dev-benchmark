import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const handle = await tasks.trigger("research-pipeline-multi_stage_ai_pipeline_orchestr__BZ6oey6", {
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"],
  });

  console.log(`Run ID: ${handle.id}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
