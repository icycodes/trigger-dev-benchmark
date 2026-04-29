import { tasks, streams } from "@trigger.dev/sdk";

async function main() {
  const run = await tasks.trigger<any>("agentTask-ai_agent_with_tool_and_streaming__4XzRy55", {
    city: "Paris",
  });

  const stream = await streams.read<string>(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  console.log(`\nRun ID: ${run.id}`);
}

main().catch(console.error);
