import { tasks, streams } from "@trigger.dev/sdk";
import { agentTask } from "./src/trigger/agent";

async function main() {
  const run = await tasks.trigger<typeof agentTask>(
    "agentTask-ai_agent_with_tool_and_streaming__iXi6w83",
    { city: "Paris" }
  );
  
  const stream = await streams.read(run.id, "ai-output");
  
  for await (const chunk of stream) {
    process.stdout.write(chunk as string);
  }
  
  console.log(`\nRun ID: ${run.id}`);
}

main().catch(console.error);
