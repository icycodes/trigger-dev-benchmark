import fs from "fs";
import { task, wait } from "@trigger.dev/sdk";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

export const deployApprovalTask = task({
  id: `deploy-approval-${trialId}`,
  run: async (payload: { version: string }) => {
    const token = await wait.createToken({
      timeout: 60 * 60 * 1000,
    });

    fs.writeFileSync(
      "/home/user/approval-workflow/approval_url.txt",
      token.url,
      "utf8"
    );

    const result = await wait.forToken<{ approved: boolean }>(token);

    if (!result.ok) {
      throw new Error("Approval waitpoint timed out");
    }

    const approved = result.output?.approved ?? false;

    return approved
      ? { status: "deployed", version: payload.version }
      : { status: "rejected", version: payload.version };
  },
});
