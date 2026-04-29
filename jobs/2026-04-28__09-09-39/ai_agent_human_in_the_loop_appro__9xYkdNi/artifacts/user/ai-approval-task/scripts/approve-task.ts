import { TriggerClient } from "@trigger.dev/sdk";

const client = new TriggerClient({
  id: "ai-approval-task",
  apiKey: process.env.TRIGGER_SECRET_KEY,
});

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Please provide a token");
    process.exit(1);
  }

  await client.tasks.completeWaitpoint(token, {
    approved: true,
    reason: "Looks good!",
  });

  console.log(`Waitpoint completed with token: ${token}`);
}

main().catch(console.error);
