import { wait, configure } from "@trigger.dev/sdk/v3";

async function main() {
  const token = process.argv[2];

  if (!token) {
    console.error("Usage: npm run approve-task <token>");
    process.exit(1);
  }

  // Configure the SDK with credentials from environment
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL ?? "https://api.trigger.dev",
  });

  console.log(`Completing waitpoint token: ${token}`);

  const result = await wait.completeToken(token, {
    approved: true,
    feedback: "Content looks great! Approved by human reviewer.",
  });

  if (result.success) {
    console.log(`Waitpoint token ${token} completed successfully.`);
    console.log("The task will now resume with approved: true");
  } else {
    console.error("Failed to complete waitpoint token.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error approving task:", err);
  process.exit(1);
});
