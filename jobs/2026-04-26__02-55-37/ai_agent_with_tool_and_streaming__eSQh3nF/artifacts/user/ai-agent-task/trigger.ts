import { tasks, streams } from "@trigger.dev/sdk";

async function main() {
  const run = await tasks.trigger("agentTask-ai_agent_with_tool_and_streaming__eSQh3nF", {
    city: "Paris",
  });

  const stream = await streams.read<string>(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  
  console.log(`\nRun ID: ${run.id}`);
}

main().catch(console.error);
