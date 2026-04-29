import { wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const tokenFilePath = path.join(
    "/home/user/resilient-pipeline",
    "waitpoint_token.txt"
  );
  const tokenId = fs.readFileSync(tokenFilePath, "utf-8").trim();
  await wait.completeToken(tokenId, { correctedInput: "fixed data" });
  console.log(`Completed waitpoint token: ${tokenId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
