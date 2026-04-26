import { tasks, streams } from "@trigger.dev/sdk";
import { readFile } from "node:fs/promises";

const trialId = (await readFile("/logs/trial_id", "utf8")).trim();

const runTask = async () => {
  const run = await tasks.trigger(`agentTask-${trialId}`, {
    city: "Paris",
  });

  const outputStream = await streams.read(run.id, "ai-output");

  for await (const chunk of outputStream) {
    process.stdout.write(chunk);
  }

  console.log(`\nRun ID: ${run.id}`);
};

runTask().catch((error) => {
  console.error(error);
  process.exit(1);
});
