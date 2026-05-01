import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

export const deployApproval = task({
  id: "deploy-approval-human_approval_workflow__wgkbrh3",
  run: async (payload: { version: string }) => {
    const token = await wait.createToken({
      timeout: "1h",
    });

    fs.writeFileSync("/home/user/approval-workflow/approval_url.txt", token.url);

    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      throw new Error("Approval timed out");
    }

    if (result.output.approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
