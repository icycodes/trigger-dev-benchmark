import { client } from "@trigger.dev/sdk/v3";
import { researchPipelineTask } from "./trigger/pipeline.ts";

// Configure the client
client.init({
  id: "ai-pipeline",
});

async function main() {
  const payload = {
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"],
  };

  const result = await researchPipelineTask.trigger(payload);

  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);