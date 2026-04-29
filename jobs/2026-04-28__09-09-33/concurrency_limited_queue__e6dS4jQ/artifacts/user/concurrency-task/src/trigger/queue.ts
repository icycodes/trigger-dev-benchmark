import { task, queue } from "@trigger.dev/sdk/v3";

const trial_id = "concurrency_limited_queue__e6dS4jQ";

export const exclusiveQueue = queue({
  name: `exclusive-queue-${trial_id}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trial_id}`,
  queue: exclusiveQueue,
  run: async (payload: { id: string }, { ctx }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      id: payload.id,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
