import { task, wait, logger } from "@trigger.dev/sdk";

const trial_id = process.env.TRIAL_ID ?? "default";

export const humanApprovalWorkflow = task({
  id: `human-approval-workflow-${trial_id}`,
  run: async (payload: { name: string }) => {
    logger.info("Workflow started", { payload });

    const token = await wait.createToken({
      timeout: "10m",
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
