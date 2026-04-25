import { task, queue } from "@trigger.dev/sdk";

const myQueue = queue({
  name: "exclusive-queue-concurrency_limited_queue__cFyjdg9",
  concurrencyLimit: 1,
});

export const exclusiveTask = task({
  id: "exclusive-task-concurrency_limited_queue__cFyjdg9",
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
