import { task, logger } from "@trigger.dev/sdk/v3";

export const retryLogicTask = task({
  id: `retry-logic-task-custom_retry_and_logging__Fr2oJVE`,
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 10000,
    factor: 2,
  },
  run: async (payload: { userId: string }, { ctx }) => {
    const attemptNumber = ctx.run.attempt.number;
    logger.info(`Attempt number: ${attemptNumber}`);

    if (attemptNumber <= 2) {
      throw new Error(`Transient failure on attempt ${attemptNumber}`);
    }

    return {
      status: "success",
      userId: payload.userId,
      attempt: attemptNumber,
    };
  },
});
