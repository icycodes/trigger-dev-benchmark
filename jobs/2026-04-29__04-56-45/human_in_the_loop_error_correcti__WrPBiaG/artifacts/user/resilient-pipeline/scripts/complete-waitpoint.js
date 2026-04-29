const { client, wait } = require("@trigger.dev/sdk");
const { readFile } = require("fs/promises");

async function completeWaitpoint() {
  const tokenId = await readFile("/home/user/resilient-pipeline/waitpoint_token.txt", "utf-8");

  await wait.completeToken({
    id: tokenId.trim(),
    output: {
      correctedInput: "fixed data",
    },
  });

  console.log("Waitpoint completed successfully");
}

completeWaitpoint().catch(console.error);