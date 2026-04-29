import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

export const deployApproval = task({
  id: "deploy-approval-human_approval_workflow__iwvYZuE",
  run: async (payload: { version: string }) => {
    // Create a waitpoint token
    const token = await wait.createToken({
      timeout: "1h", // 1 hour
    });

    // Write the waitpoint token URL to a file
    const filePath = "/home/user/approval-workflow/approval_url.txt";
    fs.writeFileSync(filePath, token.url);

    // Wait for the token
    const result = await wait.forToken<{ approved: boolean }>(token.id);

    if (!result.ok) {
      throw new Error("Waitpoint timed out or failed");
    }

    if (result.output.approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
