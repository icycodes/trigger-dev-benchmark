import { schedules, logger } from "@trigger.dev/sdk/v3";

export const syncTask = schedules.task({
  id: "scheduled-sync-scheduled_sync__MtVEfXY",
  cron: "* * * * *", // every minute
  run: async (payload, { ctx }) => {
    logger.info("Starting sync task");
    
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    
    const count = Array.isArray(data) ? data.length : 0;
    logger.info(`Processed ${count} items`);
    
    return { count };
  },
});
