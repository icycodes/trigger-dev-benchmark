import { client } from "@trigger.dev/sdk";
import { aiContentGenerator } from "../src/trigger/ai-generator";

async function main() {
  try {
    // Trigger the task
    const run = await client.sendEvent({
      name: "ai-content-generation",
      id: aiContentGenerator.id,
      payload: {},
    });

    // Print the run ID
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main();