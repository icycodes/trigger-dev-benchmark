import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

export const deployApproval = task({
  id: "deploy-approval-human_approval_workflow__zxk7mRn",
  run: async (payload: { version: string }) => {
    // Create a waitpoint token using wait.createToken() with a timeout of 1 hour
    const token = await wait.createToken({ timeout: "1h" });

    // Write the waitpoint token URL to /home/user/approval-workflow/approval_url.txt
    fs.writeFileSync("/home/user/approval-workflow/approval_url.txt", token.url);

    // Wait for the token using wait.forToken()
    const result = await wait.forToken<{ approved: boolean }>(token.id);

    // If the waitpoint times out (result not ok), throw an error
    if (!result.ok) {
      throw new Error("Waitpoint timed out or failed");
    }

    // If approved is true, return { status: "deployed", version: payload.version }
    // If approved is false, return { status: "rejected", version: payload.version }
    if (result.output.approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});