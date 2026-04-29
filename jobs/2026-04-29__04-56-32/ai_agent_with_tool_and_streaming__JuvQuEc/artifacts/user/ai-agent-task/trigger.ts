import { configure, tasks, streams } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__JuvQuEc";

async function main() {
  configure({
    accessToken: process.env.TRIGGER_SECRET_KEY!,
    baseURL: "https://api.trigger.dev",
  });

  const city = "Paris";

  console.log(`Triggering agentTask for city: ${city}`);

  const run = await tasks.trigger(`agentTask-${TRIAL_ID}`, { city });

  console.log(`Run ID: ${run.id}`);

  // Subscribe to the ai-output stream
  const stream = await streams.read<string>(run.id, "ai-output", {
    timeoutInSeconds: 300,
  });

  process.stdout.write("Streaming response: ");
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  process.stdout.write("\n");

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
