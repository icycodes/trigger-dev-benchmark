import { client } from "@trigger.dev/sdk";
import fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  const triggerClient = client({
    id: "trigger-workflow-client",
  });

  const run = await triggerClient.sendEvent({
    event: `human-approval-workflow-${trial_id}`,
    name: "human-approval-workflow",
    payload: { name: "Test Workflow" },
  });

  console.log(`Run ID: ${run.id}`);

  // Wait a bit for the workflow to start and create the token
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get the run details to extract the token ID from logs
  const runDetails = await triggerClient.getRun(run.id);

  // Extract token ID from logs
  let tokenId = "";
  for (const attempt of runDetails.attempts || []) {
    for (const log of attempt.logs || []) {
      if (log.message === "Waitpoint created" && log.properties) {
        tokenId = log.properties.tokenId as string;
        break;
      }
    }
    if (tokenId) break;
  }

  console.log(`Token ID: ${tokenId}`);
}

main().catch(console.error);