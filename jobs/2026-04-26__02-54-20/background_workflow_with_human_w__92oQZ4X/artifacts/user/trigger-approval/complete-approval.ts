import { wait } from "@trigger.dev/sdk/v3";

async function main() {
  const tokenId = process.argv[2];

  if (!tokenId) {
    console.error("Usage: npm run complete-approval <tokenId>");
    process.exit(1);
  }

  console.log(`Completing token: ${tokenId} with approved: true`);

  await wait.completeToken<{ approved: boolean }>(tokenId, {
    approved: true,
  });

  console.log("Token completed successfully. The workflow has been approved.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
