import { readFileSync } from "node:fs";

import { logger, task } from "@trigger.dev/sdk/v3";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `retry-logic-task-${trialId}`;

export const retryLogicTask = task({
  id: taskId,
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
