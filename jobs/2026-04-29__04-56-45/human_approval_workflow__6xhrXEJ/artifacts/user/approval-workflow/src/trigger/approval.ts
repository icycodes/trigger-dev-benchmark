import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

const trial_id = "human_approval_workflow__6xhrXEJ";

export const deployApprovalTask = task({
  id: `deploy-approval-${trial_id}`,
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with 1 hour timeout
    const token = await wait.createToken({
      timeout: "1h",
    });

    // Write the token URL to the approval_url.txt file
    const approvalUrlPath = path.join(__dirname, "../../../approval_url.txt");
    fs.writeFileSync(approvalUrlPath, token.url, "utf-8");

    // Wait for the token completion
    const result = await wait.forToken(token.id);

    // Check if the waitpoint completed successfully
    if (!result.ok) {
      throw new Error("Waitpoint timed out or failed");
    }

    // Check if the deployment was approved
    if (result.data.approved) {
      return {
        status: "deployed",
        version: payload.version,
      };
    } else {
      return {
        status: "rejected",
        version: payload.version,
      };
    }
  },
});