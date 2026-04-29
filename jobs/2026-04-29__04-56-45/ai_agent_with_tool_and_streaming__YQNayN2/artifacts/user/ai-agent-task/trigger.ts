import { configure, tasks, runs } from "@trigger.dev/sdk";
import { agentTask } from "./src/trigger/agent";

async function main() {
  // Configure the SDK
  configure({
    project: process.env.TRIGGER_PROJECT_REF,
  });

// Trigger the agent task with a city
  const run = await tasks.trigger(agentTask.id, {
    city: "Paris",
  });

  console.log(`Run triggered: ${run.id}`);

  // Poll for the run to complete
  let completedRun = await runs.retrieve(run.id);
  while (completedRun.status !== "COMPLETED" && completedRun.status !== "FAILED") {
    console.log(`Run status: ${completedRun.status}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    completedRun = await runs.retrieve(run.id);
  }

  console.log(`Run completed with status: ${completedRun.status}`);

  console.log(`Run started...`);

  // Subscribe to the ai-output stream
  const aiStream = await runs.fetchStream(run.id, "ai-output");

  console.log(`Stream fetched:`, typeof aiStream);
  console.log(`Stream properties:`, Object.keys(aiStream));

  // Print each chunk as it arrives
  for await (const chunk of aiStream) {
    console.log("Chunk:", chunk);
  }

  // Print the Run ID at the end
  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);