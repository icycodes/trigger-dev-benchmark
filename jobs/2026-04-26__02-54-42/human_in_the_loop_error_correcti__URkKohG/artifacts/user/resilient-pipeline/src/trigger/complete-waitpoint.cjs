const { wait } = require("@trigger.dev/sdk/v3");
const fs = require("node:fs");

async function run() {
  const tokenId = fs
    .readFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", "utf8")
    .trim();

  await wait.completeToken(tokenId, { correctedInput: "fixed data" });
  console.log("Waitpoint token completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
