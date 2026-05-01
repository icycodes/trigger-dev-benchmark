import { streams } from "@trigger.dev/sdk";

import { agentTask } from "./src/trigger/agent";

const CITY = "Paris";

const runTask = async () => {
  const run = await agentTask.trigger({ city: CITY });
  const stream = streams.read(run.id, "ai-output");

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  process.stdout.write(`\nRun ID: ${run.id}\n`);
};

runTask().catch((error) => {
  console.error("Failed to run agent task", error);
  process.exit(1);
});
