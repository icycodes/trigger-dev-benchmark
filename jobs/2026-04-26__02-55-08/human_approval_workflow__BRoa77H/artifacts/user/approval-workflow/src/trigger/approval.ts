import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

export const approvalTask = task({
  id: "deploy-approval-human_approval_workflow__BRoa77H",
  run: async (payload: { version: string }) => {
    // Create a waitpoint token with a timeout of 1 hour (3600 seconds)
    const token = await wait.createToken({
      timeoutInSeconds: 3600,
    });

    const approvalUrlFile = "/home/user/approval-workflow/approval_url.txt";
    const dir = path.dirname(approvalUrlFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the waitpoint token URL to the specified file
    fs.writeFileSync(approvalUrlFile, token.url);

    // Wait for the token to be completed
    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      // If the waitpoint times out or fails, throw an error
      throw new Error(`Waitpoint failed or timed out: ${result.error?.message || "Unknown error"}`);
    }

    const { approved } = result.output;

    if (approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
