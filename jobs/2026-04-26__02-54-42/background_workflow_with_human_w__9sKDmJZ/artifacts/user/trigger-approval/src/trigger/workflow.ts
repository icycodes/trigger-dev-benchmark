import { task, wait, logger, metadata } from "@trigger.dev/sdk";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const humanApprovalWorkflow = task({
  id: `human-approval-workflow-${trialId}`,
  run: async (payload: { name: string }) => {
    logger.info("Workflow started", { payload });

    const token = await wait.createToken({
      timeout: "10m",
    });

    metadata.set("tokenId", token.id);

    logger.info("Waitpoint created", { tokenId: token.id, url: token.url });

    const result = await wait.forToken<{ approved: boolean }>(token.id);

    if (result.ok) {
      logger.info("Result received", { approved: result.output.approved });
      return { status: "completed", approved: result.output.approved };
    }

    logger.error("Waitpoint timed out or failed", { error: result.error });
    return { status: "failed", error: result.error };
  },
});
