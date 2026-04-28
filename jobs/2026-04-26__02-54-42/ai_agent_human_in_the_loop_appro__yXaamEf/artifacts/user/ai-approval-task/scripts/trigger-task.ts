import { configure, tasks, wait } from "@trigger.dev/sdk/v3";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ai-content-generator-${trialId}`;

const accessToken = process.env.TRIGGER_SECRET_KEY;

if (!accessToken) {
  throw new Error("TRIGGER_SECRET_KEY is required to trigger tasks.");
}

configure({
  accessToken,
  baseURL: process.env.TRIGGER_API_URL,
});

async function run() {
  const token = await wait.createToken({
    tags: [`ai-approval-${trialId}`],
  });

  const handle = await tasks.trigger(taskId, {
    approvalToken: token.id,
    prompt: "A short guide to human-approved AI content",
  });

  console.log(`Run ID: ${handle.id}`);
  console.log(`Token: ${token.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
