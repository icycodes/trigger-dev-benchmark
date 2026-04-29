import { tasks, streams } from "@trigger.dev/sdk";

const trial_id = "ai_agent_with_tool_and_streaming__8zP85sX";

async function main() {
  const run = await tasks.trigger(`agentTask-${trial_id}`, {
    city: "Paris",
  });

  const stream = await streams.read(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  
  console.log(`\nRun ID: ${run.id}`);
}

main().catch(console.error);
