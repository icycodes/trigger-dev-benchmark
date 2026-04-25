import { task, wait } from "@trigger.dev/sdk";
import * as fs from "fs";

export const deployApproval = task({
  id: "deploy-approval-human_approval_workflow__FgcvnPu",
  run: async (payload: { version: string }) => {
    // 1. Create a waitpoint token with a timeout of 1 hour
    const token = await wait.createToken({
      timeout: "1h",
    });

    // 2. Write the waitpoint token URL to the specified file
    fs.writeFileSync("/home/user/approval-workflow/approval_url.txt", token.url);

    // 3. Wait for the token
    const result = await wait.forToken<{ approved: boolean }>(token);

    // 4. Handle the result
    if (!result.ok) {
      throw new Error(`Waitpoint timed out or failed`);
    }

    const { approved } = result.output;

    if (approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
