import { queue, task } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const exclusiveQueue = queue({
  name: `exclusive-queue-${trialId}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trialId}`,
  queue: exclusiveQueue,
  run: async (payload: { id: string }, { ctx }) => {
    const startedAt = ctx.run.startedAt;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const finishedAt = new Date();

    return {
      id: payload.id,
      startedAt,
      finishedAt,
    };
  },
});
