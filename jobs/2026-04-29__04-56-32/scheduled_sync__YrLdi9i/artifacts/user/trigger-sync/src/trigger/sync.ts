import { schedules } from "@trigger.dev/sdk/v3";
import { existsSync, readFileSync } from "fs";

// Read trial ID - falls back gracefully when running in build/index container
const trialId = existsSync("/logs/trial_id")
  ? readFileSync("/logs/trial_id", "utf-8").trim()
  : (process.env.TRIAL_ID ?? "scheduled_sync__YrLdi9i");

export const scheduledSyncTask = schedules.task({
  id: `scheduled-sync-${trialId}`,
  // Run every minute
  cron: "* * * * *",
  run: async (_payload) => {
    console.log("Starting data synchronization...");

    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = (await response.json()) as Array<{
      id: number;
      title: string;
      completed: boolean;
    }>;

    console.log(`Number of items processed: ${todos.length}`);

    return {
      processedCount: todos.length,
    };
  },
});
