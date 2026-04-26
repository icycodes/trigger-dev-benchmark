import { client } from "@trigger.dev/sdk";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: npm run complete-approval <tokenId>");
    process.exit(1);
  }

  const tokenId = args[0];
  const approved = args[1] === "true" ? true : args[1] === "false" ? false : true;

  const triggerClient = client({
    id: "complete-approval-client",
  });

  await triggerClient.completeToken(tokenId, { approved });

  console.log(`Token ${tokenId} completed with approved: ${approved}`);
}

main().catch(console.error);