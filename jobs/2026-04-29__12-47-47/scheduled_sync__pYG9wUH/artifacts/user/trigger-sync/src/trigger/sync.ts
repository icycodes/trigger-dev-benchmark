import { schedules } from "@trigger.dev/sdk/v3";

// trial_id is embedded at build time
const trialId = "scheduled_sync__pYG9wUH";
const taskId = `scheduled-sync-${trialId}`;

export const scheduledSyncTask = schedules.task({
  id: taskId,
  // Run every minute
  cron: "* * * * *",
  run: async (payload) => {
    console.log(`Running scheduled data sync task: ${taskId}`);
    console.log(`Scheduled at: ${payload.timestamp}`);

    // Fetch data from mock external API
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }

    const todos = (await response.json()) as Array<{
      id: number;
      userId: number;
      title: string;
      completed: boolean;
    }>;

    console.log(`Number of items processed: ${todos.length}`);

    return {
      processedCount: todos.length,
      taskId,
      timestamp: payload.timestamp,
    };
  },
});
