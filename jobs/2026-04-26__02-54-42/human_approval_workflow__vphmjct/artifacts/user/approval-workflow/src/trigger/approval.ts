import { wait, task } from "@trigger.dev/sdk";
import { readFileSync, writeFileSync } from "fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `deploy-approval-${trialId}`;
const waitTimeoutSeconds = 60 * 60;

export const deployApprovalTask = task({
  id: taskId,
  run: async (payload: { version: string }) => {
    const token = await wait.createToken({ timeout: waitTimeoutSeconds });

    writeFileSync(
      "/home/user/approval-workflow/approval_url.txt",
      token.url,
      "utf8"
    );

    const result = await wait.forToken<{ approved: boolean }>({
      token: token.token,
      timeout: waitTimeoutSeconds,
    });

    if (!result.ok) {
      throw new Error("Approval waitpoint timed out or failed");
    }

    if (result.output.approved) {
      return { status: "deployed", version: payload.version };
    }

    return { status: "rejected", version: payload.version };
  },
});
