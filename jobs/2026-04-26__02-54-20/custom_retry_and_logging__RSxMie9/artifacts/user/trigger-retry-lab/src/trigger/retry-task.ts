import { task, logger } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "custom_retry_and_logging__RSxMie9";

export const retryLogicTask = task({
  id: `retry-logic-task-${TRIAL_ID}`,
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 10000,
    factor: 2,
  },
  run: async (payload: { userId: string }, { ctx }) => {
    logger.info(`Attempt number: ${ctx.run.attempt.number}`);

    if (ctx.run.attempt.number <= 2) {
      throw new Error(`Transient failure on attempt ${ctx.run.attempt.number}`);
    }

    return {
      status: "success",
      userId: payload.userId,
      attempt: ctx.run.attempt.number,
    };
  },
});
