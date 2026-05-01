import { tasks, streams } from "@trigger.dev/sdk";

async function run() {
  const run = await tasks.trigger("agentTask-ai_agent_with_tool_and_streaming__4aJMy5o", {
    city: "Paris",
  });

  const stream = await streams.read(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  console.log(`\nRun ID: ${run.id}`);
}

run().catch(console.error);
