import "dotenv/config";
import { configure, tasks, runs, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

async function main() {
  const accessToken = process.env.TRIGGER_SECRET_KEY;
  const apiUrl = process.env.TRIGGER_API_URL ?? "https://api.trigger.dev";

  if (!accessToken) {
    console.error("Error: TRIGGER_SECRET_KEY environment variable is not set.");
    process.exit(1);
  }

  // Configure the SDK
  configure({ accessToken, baseURL: apiUrl });

  // Read trial_id to construct the task ID
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `ai-content-generator-${trialId}`;

  console.log(`Triggering task: ${taskId}`);

  // Trigger the task
  const handle = await tasks.trigger(
    taskId,
    {
      topic: "Artificial Intelligence in Modern Software Development",
      author: "TechWriter Bot",
    },
    { tags: ["demo", "approval-needed"] }
  );

  const runId = handle.id;
  console.log(`Run ID: ${runId}`);

  // Poll until the run enters WAITING state (task has paused at wait.forToken)
  console.log("Waiting for task to pause at approval waitpoint...");

  let waitpointToken: string | undefined;
  const maxAttempts = 60;
  const pollIntervalMs = 3000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(pollIntervalMs);

    const run = await runs.retrieve(runId);

    if (run.status === "WAITING") {
      // List waitpoint tokens tagged with "approval" that are currently WAITING
      const tokenList = await wait.listTokens({
        status: "WAITING",
        tags: "approval",
      });

      for await (const token of tokenList) {
        waitpointToken = token.id;
        break;
      }

      if (waitpointToken) {
        break;
      }
    }

    if (
      run.status === "COMPLETED" ||
      run.status === "FAILED" ||
      run.status === "CANCELED" ||
      run.status === "CRASHED"
    ) {
      console.error(`Run ended unexpectedly with status: ${run.status}`);
      process.exit(1);
    }

    process.stdout.write(
      `\r  Attempt ${attempt + 1}/${maxAttempts}: run status = ${run.status}...`
    );
  }

  console.log(); // newline after progress indicator

  if (!waitpointToken) {
    console.error(
      "Failed to retrieve waitpoint token. The task may not have reached the approval step yet."
    );
    process.exit(1);
  }

  console.log(`Token: ${waitpointToken}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
