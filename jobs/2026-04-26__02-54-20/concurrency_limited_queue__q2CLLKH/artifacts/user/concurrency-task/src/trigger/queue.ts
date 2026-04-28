import { queue, task } from "@trigger.dev/sdk/v3";
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
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      id: payload.id,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
