import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { agentTask } from "./src/trigger/agent";
import { readFileSync } from "fs";

const trialId = readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  // Trigger the agent task with a city
  const run = await tasks.trigger<typeof agentTask>(
    `agentTask-${trialId}`,
    { city: "Paris" }
  );

  console.log(`Run triggered! Run ID: ${run.id}`);
  console.log("Streaming AI response...\n");

  // Subscribe to the run and read the ai-output stream
  const subscription = runs.subscribeToRun(run.id);
  const stream = subscription.withStreams<{ "ai-output": string }>();

  for await (const part of stream) {
    if (part.type === "ai-output") {
      process.stdout.write(part.chunk);
    } else if (part.type === "run" && part.run.isCompleted) {
      break;
    }
  }

  console.log(`\n\nRun ID: ${run.id}`);
}

main().catch(console.error);
