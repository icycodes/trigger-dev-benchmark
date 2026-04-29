import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

export const deployApproval = task({
  id: "deploy-approval-human_approval_workflow__e3YUxvs",
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with a 1 hour timeout
    const token = await wait.createToken({
      timeout: "1h",
    });

    // Write the token URL to the approval_url.txt file
    const outputDir = "/home/user/approval-workflow";
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "approval_url.txt"), token.url);

    // Wait for the token to be completed
    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      throw new Error(`Approval waitpoint timed out: ${result.error}`);
    }

    const { approved } = result.output;

    if (approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
