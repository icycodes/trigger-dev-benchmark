import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

const TRIAL_ID = "human_approval_workflow__bF6pPz6";

export const deployApprovalTask = task({
  id: `deploy-approval-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with a 1-hour timeout
    const token = await wait.createToken({
      timeout: "1h",
    });

    // Write the approval URL to the file
    const approvalUrl = token.url;
    const outputDir = "/home/user/approval-workflow";
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "approval_url.txt"), approvalUrl);

    // Wait for the token to be completed
    const result = await wait.forToken<{ approved: boolean }>(token);

    // Handle timeout (result not ok)
    if (!result.ok) {
      throw new Error(`Approval timed out for version ${payload.version}`);
    }

    const { approved } = result.output;

    if (approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
