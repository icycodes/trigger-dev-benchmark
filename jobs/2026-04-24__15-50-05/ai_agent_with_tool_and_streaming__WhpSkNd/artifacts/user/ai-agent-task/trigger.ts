import { tasks, streams } from "@trigger.dev/sdk";

async function main() {
  const run = await tasks.trigger("agentTask-ai_agent_with_tool_and_streaming__WhpSkNd", {
    city: "Paris",
  });

  console.log(`Run ID: ${run.id}`);

  const stream = streams.read(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
}

main().catch(console.error);
