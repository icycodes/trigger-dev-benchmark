import { wait } from "@trigger.dev/sdk/v3";

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Please provide a token: npm run approve-task <token>");
    process.exit(1);
  }

  try {
    console.log(`Approving task with token: ${token}`);
    await wait.completeToken(token, {
      status: "approved",
      comment: "Looks good to me!",
    });
    console.log("Task approved successfully!");
  } catch (error) {
    console.error("Failed to approve task:", error);
    process.exit(1);
  }
}

main();
