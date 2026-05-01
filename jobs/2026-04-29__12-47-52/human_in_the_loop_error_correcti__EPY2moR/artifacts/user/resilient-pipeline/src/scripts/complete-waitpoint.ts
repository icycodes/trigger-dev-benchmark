import { wait } from "@trigger.dev/sdk";
import * as fs from "fs";

async function completeWaitpoint() {
  try {
    // Read the token ID from the file
    const tokenFilePath = "/home/user/resilient-pipeline/waitpoint_token.txt";
    const tokenId = fs.readFileSync(tokenFilePath, "utf-8").trim();

    console.log(`Completing waitpoint token: ${tokenId}`);

    // Complete the token with corrected input
    await wait.completeToken(tokenId, {
      correctedInput: "fixed data",
    });

    console.log("Waitpoint completed successfully!");
  } catch (error) {
    console.error("Error completing waitpoint:", error);
    process.exit(1);
  }
}

completeWaitpoint();