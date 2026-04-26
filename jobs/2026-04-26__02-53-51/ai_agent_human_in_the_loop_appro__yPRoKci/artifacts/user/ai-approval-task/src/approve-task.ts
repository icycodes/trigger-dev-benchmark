import { client } from "@trigger.dev/sdk";

async function approveTask(token: string) {
  const triggerClient = client({
    id: "ai-approval-task",
  });

  try {
    // Complete the waitpoint with the token
    const result = await triggerClient.completeWaitpoint(token, {
      output: { approved: true },
    });

    console.log("Task approved successfully!");
    console.log("Waitpoint completed:", result);
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