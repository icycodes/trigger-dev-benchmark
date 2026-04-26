import { runs } from "@trigger.dev/sdk/v3";

async function run() {
  const runId = process.argv[2];
  if (!runId) {
    console.error("Please provide a runId");
    process.exit(1);
  }

  try {
    await runs.cancel(runId);
    console.log(`Cancelled run: ${runId}`);
  } catch (error) {
    console.error("Failed to cancel task:", error);
    process.exit(1);
  }
}

run();
