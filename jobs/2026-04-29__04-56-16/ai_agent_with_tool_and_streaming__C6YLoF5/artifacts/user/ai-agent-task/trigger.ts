import { streams, tasks } from "@trigger.dev/sdk";
import { readFileSync } from "fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

async function run() {
  const run = await tasks.trigger(`agentTask-${trialId}`, {
    payload: {
      city: "Paris",
    },
  });

  const outputStream = await streams.read(run.id, "ai-output");

  for await (const chunk of outputStream) {
    process.stdout.write(chunk);
  }

  console.log(`\nRun ID: ${run.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
