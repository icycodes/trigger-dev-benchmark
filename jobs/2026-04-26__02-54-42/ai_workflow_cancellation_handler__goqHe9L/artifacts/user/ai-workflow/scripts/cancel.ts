import { TriggerClient } from "@trigger.dev/sdk";

const runId = process.argv[2];

if (!runId) {
  console.error("Usage: npm run cancel-task -- <runId>");
  process.exit(1);
}

const client = new TriggerClient({
  id: "ai-workflow"
});

const run = async () => {
  await client.cancelRun(runId);
  console.log(`Cancelled run ${runId}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
