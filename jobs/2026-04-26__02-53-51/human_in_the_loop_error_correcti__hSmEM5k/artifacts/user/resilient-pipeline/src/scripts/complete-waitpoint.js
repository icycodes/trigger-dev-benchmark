const { wait } = require("@trigger.dev/sdk/v3");
const fs = require("fs");
const path = require("path");

async function main() {
  // Read token ID from file
  const tokenFilePath = path.join(__dirname, "../../waitpoint_token.txt");
  const tokenId = fs.readFileSync(tokenFilePath, "utf-8").trim();

  // Complete the token with corrected input
  await wait.completeToken(tokenId, {
    correctedInput: "fixed data",
  });

  console.log(`Waitpoint token ${tokenId} completed successfully`);
}

main().catch(console.error);