import { schedules, task } from "@trigger.dev/sdk";

export const scheduledSync = schedules.task({
  id: "scheduled-sync-scheduled_sync__rg49sBB",
  run: async (payload, { ctx, logger }) => {
    // Fetch data from mock API
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json();

    // Log the number of items processed
    logger.info(`Processed ${todos.length} todos`);

    return {
      success: true,
      count: todos.length,
    };
  },
  // Schedule to run every minute
  trigger: schedules.interval({
    minutes: 1,
  }),
});