import { task, queue } from "@trigger.dev/sdk";

const exclusiveQueue = queue({
  id: "exclusive-queue-concurrency_limited_queue__WnMbgyE",
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: "exclusive-task-concurrency_limited_queue__WnMbgyE",
  queue: exclusiveQueue,
  run: async (payload: { id: string }, { ctx }) => {
    // Sleep for 3 seconds to simulate work
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Return the input id and timestamps from the task context
    return {
      id: payload.id,
      startedAt: ctx.startedAt,
      finishedAt: ctx.finishedAt,
    };
  },
});