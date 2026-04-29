import fs from "node:fs";

import { task, wait } from "@trigger.dev/sdk";

const approvalUrlPath = "/home/user/approval-workflow/approval_url.txt";

export const deployApprovalTask = task({
  id: "deploy-approval-human_approval_workflow__52HpMEb",
  run: async (payload: { version: string }) => {
    const token = await wait.createToken({
      timeout: "1h",
    });

    fs.writeFileSync(approvalUrlPath, token.url, "utf8");

    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      throw new Error("Deployment approval timed out.");
    }

    return {
      status: result.output.approved ? "deployed" : "rejected",
      version: payload.version,
    };
  },
});
