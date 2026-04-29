import { wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

async function run() {
  const token = fs.readFileSync("/home/user/resilient-pipeline/waitpoint_token.txt", "utf-8").trim();
  await wait.completeToken(token, { correctedInput: "fixed data" });
  console.log("Waitpoint completed");
}

run().catch(console.error);
