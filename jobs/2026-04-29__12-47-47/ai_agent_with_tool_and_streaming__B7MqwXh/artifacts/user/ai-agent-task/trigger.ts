import { configure, streams } from "@trigger.dev/sdk";
import { agentTask } from "./src/trigger/agent.js";

// Configure the SDK with credentials
configure({
  secretKey: process.env.TRIGGER_SECRET_KEY!,
});

async function main() {
  // Trigger the agent task with a city
  const run = await agentTask.trigger({ city: "Paris" });

  console.log(`Run ID: ${run.id}`);

  // Subscribe to the ai-output stream and print each chunk as it arrives
  const stream = await streams.read<string>(run.id, "ai-output");

  process.stdout.write("Streaming response: ");
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log(); // newline after streaming is done

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
