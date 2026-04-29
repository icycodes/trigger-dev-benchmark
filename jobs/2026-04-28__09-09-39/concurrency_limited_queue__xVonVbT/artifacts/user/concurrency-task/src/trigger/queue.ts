import { queue, task } from "@trigger.dev/sdk";

export const exclusiveQueue = queue({
  name: "exclusive-queue-concurrency_limited_queue__xVonVbT",
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: "exclusive-task-concurrency_limited_queue__xVonVbT",
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
