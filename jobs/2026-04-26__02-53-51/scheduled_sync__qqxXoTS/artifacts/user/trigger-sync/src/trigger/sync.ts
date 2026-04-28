import { schedules, logger } from "@trigger.dev/sdk";

// Define a scheduled task that runs every minute
export const scheduledSync = schedules.task({
  id: "scheduled-sync-scheduled_sync__qqxXoTS",
  name: "Scheduled Data Sync",
  cron: "* * * * *", // Run every minute
  run: async (payload, { ctx }) => {
    // Fetch data from the mock external API
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json();

    // Log the number of items processed
    logger.info(`Fetched ${todos.length} todos from the external API`);

    return {
      success: true,
      itemsProcessed: todos.length,
      timestamp: new Date().toISOString(),
    };
  },
});