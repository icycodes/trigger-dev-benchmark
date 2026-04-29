import fs from "node:fs";
import { queue, task } from "@trigger.dev/sdk/v3";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

export const exclusiveQueue = queue({
  id: `exclusive-queue-${trialId}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trialId}`,
  queue: exclusiveQueue,
  run: async (payload: { id: string }, { ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const runContext = ctx.run as typeof ctx.run & { finishedAt?: Date };

    return {
      id: payload.id,
      startedAt: runContext.startedAt,
      finishedAt: runContext.finishedAt,
    };
  },
});
