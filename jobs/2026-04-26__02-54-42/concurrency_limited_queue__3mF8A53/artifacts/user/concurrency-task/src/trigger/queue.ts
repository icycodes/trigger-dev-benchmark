import { readFileSync } from "node:fs";
import { Queue, task } from "@trigger.dev/sdk";
import { z } from "zod";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const exclusiveQueue = new Queue({
  name: `exclusive-queue-${trialId}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trialId}`,
  queue: exclusiveQueue,
  payload: z.object({
    id: z.string(),
  }),
  run: async (payload, { startedAt, finishedAt }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      id: payload.id,
      startedAt,
      finishedAt,
    };
  },
});
