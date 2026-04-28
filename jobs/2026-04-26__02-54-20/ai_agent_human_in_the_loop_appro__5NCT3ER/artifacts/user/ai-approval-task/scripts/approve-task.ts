import { configure, waitpoints } from "@trigger.dev/sdk";

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Usage: npm run approve-task <token>");
    process.exit(1);
  }

  const secretKey = process.env.TRIGGER_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TRIGGER_SECRET_KEY environment variable is required");
  }

  configure({ secretKey });

  console.log(`Completing waitpoint token: ${token}`);

  await waitpoints.completeByToken(token, {
    approved: true,
    reviewerNote: "Content looks great! Approved for publication.",
  });

  console.log("Waitpoint completed successfully. Task will resume with approved: true.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
