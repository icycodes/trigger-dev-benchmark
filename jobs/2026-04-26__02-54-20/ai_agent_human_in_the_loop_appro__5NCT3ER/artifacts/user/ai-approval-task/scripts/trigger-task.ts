import { configure, tasks, runs } from "@trigger.dev/sdk";
import * as fs from "fs";

async function main() {
  // Read credentials from environment
  const secretKey = process.env.TRIGGER_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TRIGGER_SECRET_KEY environment variable is required");
  }

  configure({ secretKey });

  // Read trial_id to build the correct task ID
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `ai-content-generator-${trialId}`;

  console.log(`Triggering task: ${taskId}`);

  // Trigger the task
  const handle = await tasks.trigger(taskId, {
    topic: "AI and the Future of Work",
  });

  console.log(`Run ID: ${handle.id}`);

  // Poll for the waitpoint token
  console.log("Waiting for task to reach waitpoint...");
  let token: string | null = null;
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const run = await runs.retrieve(handle.id);

    if (run.status === "COMPLETED" || run.status === "FAILED" || run.status === "CRASHED") {
      console.log(`Run ended with status: ${run.status}`);
      break;
    }

    // Check for waitpoints - look for WAIT_FOR_TOKEN status
    if (run.status === "WAITING") {
      // Retrieve the waitpoint token from the run's metadata/waitpoints
      const waitpoints = (run as any).waitpoints;
      if (waitpoints && Array.isArray(waitpoints) && waitpoints.length > 0) {
        token = waitpoints[0].token ?? waitpoints[0].id ?? null;
        if (token) break;
      }
    }
  }

  if (token) {
    console.log(`Token: ${token}`);
  } else {
    // Fallback: try listing run waitpoints via API
    const apiUrl = process.env.TRIGGER_API_URL ?? "https://api.trigger.dev";
    const response = await fetch(`${apiUrl}/api/v1/runs/${handle.id}/waitpoints`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (response.ok) {
      const data = (await response.json()) as any;
      const waitpoint = data?.data?.[0] ?? data?.[0];
      if (waitpoint?.token) {
        console.log(`Token: ${waitpoint.token}`);
      } else {
        console.log("Token: (not yet available - task may still be initializing)");
        console.log("Run ID:", handle.id);
        console.log("Full waitpoints response:", JSON.stringify(data, null, 2));
      }
    } else {
      console.log("Token: (could not retrieve - check run status manually)");
      console.log("Run ID:", handle.id);
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
