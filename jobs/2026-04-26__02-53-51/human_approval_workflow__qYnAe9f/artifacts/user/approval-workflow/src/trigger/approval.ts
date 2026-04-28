import { task, wait } from "@trigger.dev/sdk";
import fs from "fs";
import path from "path";

const TRIAL_ID = "human_approval_workflow__qYnAe9f";

export const deployApprovalTask = task({
  id: `deploy-approval-${TRIAL_ID}`,
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with 1 hour timeout
    const token = await wait.createToken({
      timeout: 3600, // 1 hour in seconds
    });

    // Write the token URL to the approval file
    const approvalDir = "/home/user/approval-workflow";
    fs.mkdirSync(approvalDir, { recursive: true });
    fs.writeFileSync(
      path.join(approvalDir, "approval_url.txt"),
      token.url,
      "utf-8"
    );

    // Wait for the token to be completed
    const result = await wait.forToken(token);

    // Check if the waitpoint timed out
    if (!result.ok) {
      throw new Error("Approval waitpoint timed out");
    }

    // Process the approval result
    if (result.output.approved) {
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