import { client, task } from "@trigger.dev/sdk/v3";

client.init({
  id: "retry-logic-task-custom_retry_and_logging__pg8gKDP",
});

export const retryLogicTask = task({
  id: "retry-logic-task-custom_retry_and_logging__pg8gKDP",
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 10000,
    factor: 2,
  },
  run: async (payload: { userId: string }, { logger, run }) => {
    logger.info(`Attempt number: ${run.attempt.number}`);

    if (run.attempt.number <= 2) {
      throw new Error(`Transient failure on attempt ${run.attempt.number}`);
    }

    return {
      status: "success",
      userId: payload.userId,
      attempt: run.attempt.number,
    };
  },
});