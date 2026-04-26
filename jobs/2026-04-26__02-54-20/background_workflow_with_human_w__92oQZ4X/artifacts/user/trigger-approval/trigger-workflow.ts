import { tasks, runs } from "@trigger.dev/sdk/v3";
import { humanApprovalWorkflow } from "./src/trigger/workflow";
import fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  // Trigger the human approval workflow task
  const handle = await tasks.trigger<typeof humanApprovalWorkflow>(
    `human-approval-workflow-${trial_id}`,
    { name: "test-approval" }
  );

  const runId = handle.id;
  console.log(`Run ID: ${runId}`);

  // Poll run logs until we find the tokenId logged by the task
  console.log("Waiting for task to create waitpoint token...");

  let tokenId: string | undefined;
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const run = await runs.retrieve(runId);

      // Check if run has failed or completed unexpectedly
      if (run.status === "COMPLETED" || run.status === "FAILED" || run.status === "CRASHED" || run.status === "SYSTEM_FAILURE") {
        console.error(`Run ended unexpectedly with status: ${run.status}`);
        process.exit(1);
      }

      // Fetch run logs to extract tokenId
      const logsResponse = await fetch(
        `${process.env.TRIGGER_API_URL ?? "https://api.trigger.dev"}/api/v1/runs/${runId}/logs`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
          },
        }
      );

      if (logsResponse.ok) {
        const logsText = await logsResponse.text();
        const tokenMatch = logsText.match(/"tokenId"\s*:\s*"([^"]+)"/);
        if (tokenMatch) {
          tokenId = tokenMatch[1];
          break;
        }
      }
    } catch (err) {
      // Continue polling
    }
  }

  if (!tokenId) {
    // Try fetching run attempts to find the token from task logs
    // Fallback: look for WAITING_FOR_DEPLOY or EXECUTING status
    try {
      const run = await runs.retrieve(runId);
      console.log(`Run status: ${run.status}`);

      // Try to get token from run metadata or logs via SDK
      // Attempt to search logs directly  
      const logsResponse = await fetch(
        `${process.env.TRIGGER_API_URL ?? "https://api.trigger.dev"}/api/v3/runs/${runId}/logs`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
          },
        }
      );

      if (logsResponse.ok) {
        const logsText = await logsResponse.text();
        console.log("Logs response:", logsText.substring(0, 500));
        const tokenMatch = logsText.match(/"tokenId"\s*:\s*"([^"]+)"/);
        if (tokenMatch) {
          tokenId = tokenMatch[1];
        }
      }
    } catch (err) {
      console.error("Error fetching run details:", err);
    }
  }

  if (tokenId) {
    console.log(`Token ID: ${tokenId}`);
  } else {
    console.error(
      "Could not retrieve Token ID from run logs within the timeout period."
    );
    console.log(
      "The run is still executing and waiting for token completion."
    );
    console.log(
      "You can check the Trigger.dev dashboard for the token ID."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
