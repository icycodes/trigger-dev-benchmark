import "dotenv/config";
import { configure, wait } from "@trigger.dev/sdk/v3";

async function main() {
  const token = process.argv[2];

  if (!token) {
    console.error("Usage: npm run approve-task <token>");
    console.error(
      "  <token>  The waitpoint token ID to complete (e.g. waitpoint_xxxxx)"
    );
    process.exit(1);
  }

  const accessToken = process.env.TRIGGER_SECRET_KEY;
  const apiUrl = process.env.TRIGGER_API_URL ?? "https://api.trigger.dev";

  if (!accessToken) {
    console.error("Error: TRIGGER_SECRET_KEY environment variable is not set.");
    process.exit(1);
  }

  // Configure the SDK
  configure({ accessToken, baseURL: apiUrl });

  console.log(`Completing waitpoint token: ${token}`);

  // Complete the waitpoint token with approval payload
  await wait.completeToken(token, {
    data: { approved: true },
  });

  console.log("Waitpoint completed successfully. Task will now resume.");
  console.log("The AI content has been approved!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
