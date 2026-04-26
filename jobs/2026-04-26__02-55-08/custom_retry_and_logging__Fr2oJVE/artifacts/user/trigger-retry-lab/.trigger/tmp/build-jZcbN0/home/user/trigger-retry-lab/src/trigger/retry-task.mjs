import {
  logger,
  task
} from "../../../../../chunk-6QNTXUIC.mjs";
import "../../../../../chunk-MZMYRHEF.mjs";
import {
  __name,
  init_esm
} from "../../../../../chunk-YNHHDKFZ.mjs";

// src/trigger/retry-task.ts
init_esm();
var retryLogicTask = task({
  id: `retry-logic-task-custom_retry_and_logging__Fr2oJVE`,
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2e3,
    maxTimeoutInMs: 1e4,
    factor: 2
  },
  run: /* @__PURE__ */ __name(async (payload, { ctx }) => {
    const attemptNumber = ctx.run.attempt.number;
    logger.info(`Attempt number: ${attemptNumber}`);
    if (attemptNumber <= 2) {
      throw new Error(`Transient failure on attempt ${attemptNumber}`);
    }
    return {
      status: "success",
      userId: payload.userId,
      attempt: attemptNumber
    };
  }, "run")
});
export {
  retryLogicTask
};
//# sourceMappingURL=retry-task.mjs.map
