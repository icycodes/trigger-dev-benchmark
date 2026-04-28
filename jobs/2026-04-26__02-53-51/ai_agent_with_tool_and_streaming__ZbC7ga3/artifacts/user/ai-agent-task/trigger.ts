import { configure, tasks, runs } from "@trigger.dev/sdk";
import { agentTask } from "./src/trigger/agent";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__ZbC7ga3";

async function main() {
  // Configure the Trigger.dev client
  configure({
    accessToken: process.env.TRIGGER_SECRET_KEY!,
  });

  // Trigger the agent task with a city (e.g., "Paris")
  const run = await tasks.trigger(agentTask, {
    city: "Paris",
  });

  console.log(`Task triggered with run ID: ${run.id}`);

  // Subscribe to the run to get real-time updates
  console.log("Subscribing to run updates...");
  for await (const runUpdate of runs.subscribeToRun(run.id)) {
    console.log(`Run status: ${runUpdate.status}`);

    // If the run is executing or completed, try to read the stream
    if (runUpdate.status === "EXECUTING" || runUpdate.status === "COMPLETED") {
      try {
        const stream = await runs.fetchStream(run.id, "ai-output");

        console.log("Stream fetched successfully");

        // Print each chunk as it arrives
        let chunkCount = 0;
        for await (const chunk of stream) {
          console.log(`Chunk ${chunkCount}:`, chunk);
          chunkCount++;
        }

        console.log(`Total chunks received: ${chunkCount}`);
      } catch (error) {
        console.error("Error fetching stream:", error);
      }

      // Break if completed
      if (runUpdate.status === "COMPLETED") {
        break;
      }
    }
  }

  // Print the run ID at the end
  console.log(`Run ID: ${run.id}`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});