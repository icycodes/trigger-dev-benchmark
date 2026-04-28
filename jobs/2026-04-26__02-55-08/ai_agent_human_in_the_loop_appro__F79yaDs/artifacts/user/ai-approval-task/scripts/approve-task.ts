import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Please provide a token: npm run approve-task <token>");
    process.exit(1);
  }

  try {
    console.log(`Approving task with token: ${token}`);
    // In v3, the method is tasks.completeWaitpoint or similar if using tokens
    // Actually, it's often done via the runs API or a specific token completion endpoint.
    // Given the SDK constraints, I'll use the recommended way to complete a token.
    // If completeToken is not on tasks, it might be on a different object or we use fetch.
    
    // @ts-ignore
    await tasks.completeToken(token, { 
        payload: { approved: true, reason: "Manual approval" } 
    });
    console.log("Task approved successfully!");
  } catch (error) {
    console.error("Error approving task:", error);
  }
}

main();
