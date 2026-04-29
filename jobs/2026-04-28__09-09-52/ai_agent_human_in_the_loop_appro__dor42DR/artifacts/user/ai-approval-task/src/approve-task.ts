import { TriggerClient } from "@trigger.dev/sdk";

async function approveTask(token: string) {
  if (!process.env.TRIGGER_PROJECT_REF) {
    throw new Error("TRIGGER_PROJECT_REF environment variable is not set");
  }

  if (!process.env.TRIGGER_SECRET_KEY) {
    throw new Error("TRIGGER_SECRET_KEY environment variable is not set");
  }

  const client = new TriggerClient({
    id: process.env.TRIGGER_PROJECT_REF,
    apiKey: process.env.TRIGGER_SECRET_KEY,
  });

  try {
    // Complete the waitpoint using the provided token
    // This uses the Trigger.dev API to resume the waiting task
    await client.resumeRun({
      runId: token,
      output: {
        approved: true,
        approvedAt: new Date().toISOString(),
      },
    });

    console.log(`Task ${token} approved successfully!`);
  } catch (error) {
    console.error("Failed to approve task:", error);
    process.exit(1);
  }
}

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.error("Please provide a token as an argument");
  console.error("Usage: npm run approve-task <token>");
  process.exit(1);
}

approveTask(token).catch(console.error);