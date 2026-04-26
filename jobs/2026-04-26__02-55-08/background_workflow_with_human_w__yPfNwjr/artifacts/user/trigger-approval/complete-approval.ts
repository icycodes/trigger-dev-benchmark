import { waitpoints } from "@trigger.dev/sdk";

async function main() {
  const tokenId = process.argv[2];
  if (!tokenId) {
    console.error("Please provide a Token ID");
    process.exit(1);
  }

  await waitpoints.complete(tokenId, {
    output: { approved: true },
  });

  console.log(`Token ${tokenId} completed with approved: true`);
}

main().catch(console.error);
