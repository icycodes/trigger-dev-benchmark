import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

export const deployApprovalTask = task({
  id: "deploy-approval-human_approval_workflow__8f9EXXb",
  run: async (payload: { version: string }) => {
    // Create a waitpoint token
    const token = await wait.createToken({
      timeout: "1h",
    });

    // Write the waitpoint token URL to a file
    fs.writeFileSync("/home/user/approval-workflow/approval_url.txt", token.url);

    // Wait for the token
    const result = await wait.forToken<{ approved: boolean }>(token.id);

    if (!result.ok) {
      throw new Error(`Waitpoint failed or timed out: ${result.error.message}`);
    }

    if (result.output.approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
