import { schedules, logger } from "@trigger.dev/sdk";

export const syncTask = schedules.task({
  id: "scheduled-sync-scheduled_sync__AhEGSL8",
  cron: "* * * * *",
  run: async (payload, { ctx }) => {
    logger.info("Starting sync task");
    
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    
    logger.info(`Fetched ${data.length} todos`);
    
    return {
      processedItems: data.length,
    };
  },
});
