import { researchPipeline } from "./trigger/pipeline";

async function main() {
  const handle = await researchPipeline.trigger({
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"]
  });
  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
