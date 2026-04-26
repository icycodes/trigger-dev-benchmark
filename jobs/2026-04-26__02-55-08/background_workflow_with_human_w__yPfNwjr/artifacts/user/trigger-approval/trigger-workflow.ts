import { runs, tasks } from "@trigger.dev/sdk";
import fs from "fs";

async function main() {
  const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `human-approval-workflow-${trial_id}`;

  console.log(`Triggering task: ${taskId}`);
  try {
      const handle = await tasks.trigger(taskId, { name: "Test User" });
      console.log(`Run ID: ${handle.id}`);

      let tokenId: string | undefined;
      let attempts = 0;
      while (!tokenId && attempts < 30) {
        attempts++;
        const run = await runs.retrieve(handle.id);
        console.log(`Run status: ${run.status}`);
        if (run.status === "FAILED") {
            console.error("Run failed");
            process.exit(1);
        }
        
        const sdk = require("@trigger.dev/sdk");
        if (sdk.waitpoints) {
            const result = await sdk.waitpoints.list({ runId: handle.id });
            if (result.data && result.data.length > 0) {
                tokenId = result.data[0].id;
            }
        }

        if (!tokenId) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!tokenId) {
        console.error("Timed out waiting for Token ID");
        process.exit(1);
      }

      console.log(`Token ID: ${tokenId}`);
  } catch (err) {
      console.error("Error triggering task:", err);
      process.exit(1);
  }
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
