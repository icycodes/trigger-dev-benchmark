import { tasks, wait } from "@trigger.dev/sdk/v3";
import { aiContentGenerator } from "./trigger/ai-generator";

async function main() {
  try {
    // Create a waitpoint token
    const token = await wait.createToken({
      timeout: "24h", // Ensure it doesn't expire too quickly
    });

    // Trigger the task with the token ID
    const handle = await tasks.trigger(aiContentGenerator.id, {
      tokenId: token.id,
      prompt: "Write a blog post about Trigger.dev waitpoints"
    });

    console.log(`Run ID: ${handle.id}`);
    console.log(`Token: ${token.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

main();
