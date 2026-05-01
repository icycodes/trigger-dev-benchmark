import { task, wait } from "@trigger.dev/sdk";
import fs from "fs";

const trial_id = "human_approval_workflow__RPeARwV";

export const deployApprovalTask = task({
  id: `deploy-approval-${trial_id}`,
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with 1 hour timeout (3600 seconds)
    const token = await wait.createToken({
      timeout: 3600,
    });

    // Write the waitpoint token URL to the file
    fs.writeFileSync("/home/user/approval-workflow/approval_url.txt", token.url);

    // Wait for the token to be completed
    const result = await wait.forToken(token);

    // Check if the waitpoint was successful
    if (!result.ok) {
      throw new Error(`Waitpoint timed out or failed: ${result.error}`);
    }

    // The completion payload will be an object: { approved: boolean }
    const approvalData = result.output as { approved: boolean };

    if (approvalData.approved) {
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