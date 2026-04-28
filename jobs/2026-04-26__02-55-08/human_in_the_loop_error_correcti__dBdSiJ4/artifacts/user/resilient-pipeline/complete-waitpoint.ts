import { wait } from "@trigger.dev/sdk";
import { readFileSync } from "fs";

async function run() {
  const token = readFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", "utf-8").trim();
  await wait.completeToken(token, { correctedInput: "fixed data" });
  console.log(`Completed token: ${token}`);
}

run().catch(console.error);
