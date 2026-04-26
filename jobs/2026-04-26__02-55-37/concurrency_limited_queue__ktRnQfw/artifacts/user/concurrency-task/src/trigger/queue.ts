import { task, queue } from "@trigger.dev/sdk";

const trial_id = "concurrency_limited_queue__ktRnQfw";

export const myQueue = queue({
  name: `exclusive-queue-${trial_id}`,
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: `exclusive-task-${trial_id}`,
  queue: myQueue,
  run: async (payload: { id: string }, { ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      id: payload.id,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
