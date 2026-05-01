import { schedules, logger } from "@trigger.dev/sdk/v3";

export const scheduledSync = schedules.task({
  id: "scheduled-sync-scheduled_sync__aW4W4PG",
  cron: "*/1 * * * *",
  run: async (payload) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = (await response.json()) as any[];
    logger.log(`Fetched ${data.length} todos`);
    return { count: data.length };
  },
});
