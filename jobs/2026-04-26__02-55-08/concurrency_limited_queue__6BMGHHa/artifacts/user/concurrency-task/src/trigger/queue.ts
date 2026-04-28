import { task, queue } from "@trigger.dev/sdk/v3";

const trialId = "concurrency_limited_queue__6BMGHHa";

export const exclusiveQueue = queue({
  name: `exclusive-queue-${trialId}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trialId}`,
  queue: {
    name: `exclusive-queue-${trialId}`,
  },
  run: async (payload: { id: string }, { ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      id: payload.id,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
