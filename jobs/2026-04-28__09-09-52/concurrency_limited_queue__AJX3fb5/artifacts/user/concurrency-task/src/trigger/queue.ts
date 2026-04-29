import { client, task, Queue } from "@trigger.dev/sdk/v3";

// Define the queue with concurrency limit of 1
export const exclusiveQueue = new Queue({
  id: "exclusive-queue-concurrency_limited_queue__AJX3fb5",
  concurrencyLimit: 1,
});

// Define the task that uses the queue
export const exclusiveTask = task({
  id: "exclusive-task-concurrency_limited_queue__AJX3fb5",
  queue: {
    id: "exclusive-queue-concurrency_limited_queue__AJX3fb5",
  },
  run: async (payload: { id: string }, { ctx }) => {
    // Sleep for 3 seconds to simulate work
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Return the input id and timestamps
    return {
      id: payload.id,
      startedAt: ctx.startedAt,
      finishedAt: ctx.finishedAt,
    };
  },
});