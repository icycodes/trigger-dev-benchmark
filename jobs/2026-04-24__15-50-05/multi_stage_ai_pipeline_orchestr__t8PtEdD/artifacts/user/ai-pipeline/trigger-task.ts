import { researchPipelineTask } from "./src/trigger/pipeline";

async function main() {
  const result = await researchPipelineTask.trigger({
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"],
  });

  console.log(`Run ID: ${result.id}`);
}

main().catch((err) => {
  console.error("Error triggering task:", err);
  process.exit(1);
});
