import { wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

async function run() {
  const tokenFilePath = "/home/user/resilient-pipeline/waitpoint_token.txt";
  if (!fs.existsSync(tokenFilePath)) {
    console.error("waitpoint_token.txt not found");
    process.exit(1);
  }
  const tokenId = fs.readFileSync(tokenFilePath, "utf-8").trim();
  await wait.completeToken(tokenId, { correctedInput: "fixed data" });
  console.log(`Completed token: ${tokenId}`);
}

run().catch(console.error);
