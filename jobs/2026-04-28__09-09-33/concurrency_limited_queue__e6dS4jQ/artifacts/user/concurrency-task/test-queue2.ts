import { task, queue } from "@trigger.dev/sdk/v3";
export const exclusiveQueue = queue({
  name: `exclusive-queue-123`,
  concurrencyLimit: 1,
});
export const exclusiveTask = task({
  id: `exclusive-task-123`,
  queue: exclusiveQueue,
  run: async () => {}
});
