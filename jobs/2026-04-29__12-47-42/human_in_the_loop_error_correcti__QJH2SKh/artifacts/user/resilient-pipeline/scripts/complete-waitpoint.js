const { wait } = require("@trigger.dev/sdk/v3");
const { readFileSync } = require("node:fs");

async function main() {
  const tokenId = readFileSync(
    "/home/user/resilient-pipeline/waitpoint_token.txt",
    "utf8"
  ).trim();

  if (!tokenId) {
    throw new Error("waitpoint_token.txt is empty.");
  }

  await wait.completeToken(tokenId, { correctedInput: "fixed data" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
