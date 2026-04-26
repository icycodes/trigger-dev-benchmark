import { configure, runs, tasks } from "@trigger.dev/sdk";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `human-approval-workflow-${trialId}`;

if (process.env.TRIGGER_SECRET_KEY) {
  configure({ accessToken: process.env.TRIGGER_SECRET_KEY });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const run = await tasks.trigger(taskId, { name: "Human approval" });

const runId = run.id;
let tokenId: string | undefined;

for (let attempt = 0; attempt < 30; attempt += 1) {
  const runDetails = await runs.retrieve(runId);
  const metadata = runDetails.metadata as Record<string, unknown> | undefined;

  if (metadata && typeof metadata.tokenId === "string") {
    tokenId = metadata.tokenId;
    break;
  }

  await sleep(1000);
}

if (!tokenId) {
  throw new Error("Token ID was not found in run metadata.");
}

console.log(`Run ID: ${runId}`);
console.log(`Token ID: ${tokenId}`);
