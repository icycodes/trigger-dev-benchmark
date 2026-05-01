import { TriggerClient, streams } from "@trigger.dev/sdk";
import { agentTask } from "./src/trigger/agent";

const trial_id = "ai_agent_with_tool_and_streaming__6ANSN3z";

async function main() {
  const client = new TriggerClient({
    id: `ai-agent-client-${trial_id}`,
    apiKey: process.env.TRIGGER_API_KEY!,
  });

  console.log("Triggering agent task...");

  // Trigger the agent task with a city
  const run = await agentTask.trigger(client, {
    city: "Paris",
  });

  console.log(`Run ID: ${run.id}`);
  console.log("Streaming AI response...");

  // Subscribe to the ai-output stream
  const stream = streams.read(run.id, "ai-output");

  // Print each chunk as it arrives
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  console.log("\n\nStreaming complete!");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});