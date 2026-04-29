import { task, wait } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

export const approvalTask = task({
  id: "deploy-approval-human_approval_workflow__bxvdRFL",
  run: async (payload: { version: string }) => {
    const { token, publicUrl } = await wait.createToken({
      timeout: "1h",
    });

    const approvalFilePath = "/home/user/approval-workflow/approval_url.txt";
    fs.mkdirSync(path.dirname(approvalFilePath), { recursive: true });
    fs.writeFileSync(approvalFilePath, publicUrl);

    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      throw new Error(`Waitpoint failed or timed out: ${result.error}`);
    }

    if (result.payload.approved) {
      return { status: "deployed", version: payload.version };
    } else {
      return { status: "rejected", version: payload.version };
    }
  },
});
