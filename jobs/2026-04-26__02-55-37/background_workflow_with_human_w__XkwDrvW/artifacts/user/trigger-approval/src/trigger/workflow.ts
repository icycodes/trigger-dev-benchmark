import { task, wait, logger } from "@trigger.dev/sdk";
import * as fs from "fs";

const trial_id = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const humanApprovalWorkflow = task({
  id: `human-approval-workflow-${trial_id}`,
  run: async (payload: { name: string }, { ctx }) => {
    logger.info("Workflow started", { payload });

    const token = await wait.createToken({
      timeout: "10m",
      tags: [ctx.run.id],
    });

    logger.info("Waitpoint created", { tokenId: token.id, url: token.url });

    const result = await wait.forToken<{ approved: boolean }>(token.id);

    if (result.ok) {
      logger.info("Result received", { approved: result.output.approved });
      return { status: "completed", approved: result.output.approved };
    } else {
      logger.error("Waitpoint timed out or failed", { error: result.error });
      return { status: "failed", error: result.error };
    }
  },
});
