import { runs } from "@trigger.dev/sdk/v3";

async function main() {
  const runId = process.argv[2];
  if (!runId) {
    console.error("Please provide a run ID");
    process.exit(1);
  }
  
  await runs.cancel(runId);
  console.log(`Cancelled run: ${runId}`);
}

main().catch(console.error);
