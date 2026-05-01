import { wait } from "@trigger.dev/sdk";
import * as fs from "fs";

async function main() {
  const tokenPath = "/home/user/resilient-pipeline/waitpoint_token.txt";
  const token = fs.readFileSync(tokenPath, "utf-8").trim();
  
  await wait.completeToken(token, {
    correctedInput: "fixed data",
  });
  console.log("Waitpoint completed");
}

main().catch(console.error);
