import { task, logger } from "@trigger.dev/sdk";

export const retryLogicTask = task({
  id: "retry-logic-task-custom_retry_and_logging__cSe89Fj",
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 10000,
    factor: 2,
  },
  run: async (payload: { userId: string }, { ctx }: any) => {
    if (!ctx.run) {
      ctx.run = { attempt: ctx.attempt };
    }

    logger.info(`Attempt number: ${ctx.run.attempt.number}`);

    if (ctx.run.attempt.number < 3) {
      throw new Error(`Transient failure on attempt ${ctx.run.attempt.number}`);
    }

    return {
      status: "success",
      userId: payload.userId,
      attempt: ctx.run.attempt.number,
    };
  },
});
