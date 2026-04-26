import { task, wait } from "@trigger.dev/sdk/v3";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ai-content-generator-${trialId}`;

type AiGeneratorPayload = {
  approvalToken: string;
  prompt?: string;
};

type ApprovalResult = {
  approved: boolean;
  reviewer?: string;
};

export const aiContentGenerator = task({
  id: taskId,
  run: async (payload: AiGeneratorPayload) => {
    const title = `Human-in-the-loop AI: ${payload.prompt ?? "Practical approvals"}`;
    const summary =
      "This article outlines how to combine AI generation with human approval checkpoints to keep workflows reliable and compliant.";

    const approval = await wait.forToken<ApprovalResult>(payload.approvalToken).unwrap();

    return {
      title,
      summary,
      approved: approval.approved,
    };
  },
});
