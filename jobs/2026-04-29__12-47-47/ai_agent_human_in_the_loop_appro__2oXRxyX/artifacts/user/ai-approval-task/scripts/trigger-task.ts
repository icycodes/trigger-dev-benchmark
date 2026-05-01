import { tasks, wait, configure } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as crypto from "crypto";

async function main() {
  // Read the trial_id from /logs/trial_id
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `ai-content-generator-${trialId}`;

  // Configure the SDK with credentials from environment
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL ?? "https://api.trigger.dev",
  });

  // Generate a unique run tag so we can locate the waitpoint token
  const runTag = crypto.randomUUID();

  // Trigger the task with a sample payload
  const handle = await tasks.trigger(taskId, {
    topic: "AI in Modern Software Development",
    runTag,
  });

  const runId = handle.id;
  console.log(`Task triggered successfully.`);
  console.log(`Waiting for waitpoint token to be created (tag: run:${runTag})...`);

  // Poll wait.listTokens() filtering by the run-specific tag
  let token: string | undefined;
  const maxAttempts = 30;
  const pollIntervalMs = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    try {
      const page = await wait.listTokens({ tags: [`run:${runTag}`] });

      if (page.data && page.data.length > 0) {
        token = page.data[0].id;
        break;
      }
    } catch (err) {
      // Keep polling
    }
  }

  if (!token) {
    console.error("Failed to retrieve waitpoint token after polling.");
    process.exit(1);
  }

  console.log(`Run ID: ${runId}`);
  console.log(`Token: ${token}`);
}

main().catch((err) => {
  console.error("Error triggering task:", err);
  process.exit(1);
});
