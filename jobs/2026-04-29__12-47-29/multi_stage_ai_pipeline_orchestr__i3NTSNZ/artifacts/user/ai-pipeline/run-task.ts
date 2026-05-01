import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__i3NTSNZ";
  
  const handle = await tasks.trigger<any>(
    `research-pipeline-${TRIAL_ID}`,
    {
      topic: "Artificial Intelligence",
      languages: ["Spanish", "French", "German"]
    }
  );
  
  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
