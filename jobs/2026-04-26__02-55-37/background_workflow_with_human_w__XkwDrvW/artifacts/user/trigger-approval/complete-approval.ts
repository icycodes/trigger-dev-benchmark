import { wait } from "@trigger.dev/sdk";

async function main() {
  const tokenId = process.argv[2];
  if (!tokenId) {
    console.error("Please provide a Token ID as an argument.");
    process.exit(1);
  }

  // Complete the token
  await wait.completeToken(tokenId, { approved: true });
  console.log(`Token ${tokenId} completed with { approved: true }`);
}

main().catch(console.error);
