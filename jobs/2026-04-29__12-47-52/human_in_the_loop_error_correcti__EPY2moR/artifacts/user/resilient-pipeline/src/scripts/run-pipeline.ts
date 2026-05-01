import { client } from "@trigger.dev/sdk";
import * as fs from "fs";

// Read trial_id from /logs/trial_id
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function runPipeline() {
  try {
    console.log("Starting resilient pipeline...");

    // Trigger the parent task with initial input
    const run = await client.sendEvent({
      name: `resilient-pipeline-${trialId}`,
      payload: {
        input: "initial data",
      },
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error starting pipeline:", error);
    process.exit(1);
  }
}

runPipeline();