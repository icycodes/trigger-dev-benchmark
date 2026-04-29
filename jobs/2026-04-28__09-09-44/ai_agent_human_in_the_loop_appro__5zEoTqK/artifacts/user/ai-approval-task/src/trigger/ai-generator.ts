import { task, wait } from "@trigger.dev/sdk";
import { readFileSync } from "node:fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ai-content-generator-${trialId}`;

type ApprovalData = {
  approved: boolean;
  approvedAt?: string;
};

type Payload = {
  topic?: string;
  approvalToken: string;
};

export const aiContentGenerator = task({
  id: taskId,
  run: async (payload: Payload) => {
    const topic = payload.topic ?? "human-in-the-loop AI workflows";
    const content = {
      title: `AI-Generated Title: ${topic}`,
      summary: `This summary explores ${topic}, highlighting how approvals keep automated generation accurate, compliant, and safe to publish.`,
    };

    const approval = await wait.forToken<ApprovalData>(payload.approvalToken);

    if (!approval.ok) {
      throw approval.error;
    }

    return {
      approved: true,
      content,
      approval: approval.output,
    };
  },
});
