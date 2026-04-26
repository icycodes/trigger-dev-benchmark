import { tasks, wait } from "@trigger.dev/sdk";
import * as fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  const taskId = `human-approval-workflow-${trial_id}`;
  
  // Trigger the task
  const run = await tasks.trigger(taskId, { name: "Test User" });
  
  console.log(`Run ID: ${run.id}`);

  // Poll to find the waitpoint token created by the task
  let tokenId: string | null = null;
  while (!tokenId) {
    const tokens = wait.listTokens({ tags: run.id });
    for await (const token of tokens) {
      tokenId = token.id;
      break;
    }
    if (!tokenId) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`Token ID: ${tokenId}`);
}

main().catch(console.error);
