import { schedules } from "@trigger.dev/sdk/v3";

const trialId = "scheduled_sync__nnPoQ5K";
const taskId = `scheduled-sync-${trialId}`;

export const scheduledSyncTask = schedules.task({
  id: taskId,
  // Run every minute
  cron: "* * * * *",
  run: async (payload) => {
    console.log(`[${taskId}] Starting data synchronization...`);
    console.log(`[${taskId}] Scheduled at: ${payload.timestamp}`);

    // Fetch data from mock external API
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }

    const todos = (await response.json()) as Array<{
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    }>;

    console.log(`[${taskId}] Number of items processed: ${todos.length}`);

    return {
      taskId,
      itemsProcessed: todos.length,
      timestamp: payload.timestamp,
    };
  },
});
