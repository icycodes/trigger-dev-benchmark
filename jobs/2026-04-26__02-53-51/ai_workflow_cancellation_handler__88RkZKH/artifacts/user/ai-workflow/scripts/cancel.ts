import { client } from "@trigger.dev/sdk";

async function main() {
  // Get run ID from command line arguments
  const runId = process.argv[2];
  
  if (!runId) {
    console.error("Error: Run ID is required");
    console.error("Usage: npm run cancel-task -- <runId>");
    process.exit(1);
  }

  try {
    // Cancel the task
    await client.cancelRun(runId);
    
    console.log(`Task ${runId} has been cancelled successfully`);
  } catch (error) {
    console.error("Error cancelling task:", error);
    process.exit(1);
  }
}

main();