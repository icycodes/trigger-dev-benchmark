import { queue, task } from "@trigger.dev/sdk";

export const myQueue = queue({
  name: "exclusive-queue",
  concurrencyLimit: 1,
});

export const myTask = task({
  id: "exclusive-task",
  queue: myQueue,
  run: async (payload: { id: string }, { ctx }) => {
    return {
      id: payload.id,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  }
});
