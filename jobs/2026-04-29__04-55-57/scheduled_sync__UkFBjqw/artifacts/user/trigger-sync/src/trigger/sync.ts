import { schedules } from "@trigger.dev/sdk/v3";

export const syncTask = schedules.task({
  id: "scheduled-sync-scheduled_sync__UkFBjqw",
  cron: "* * * * *", // every minute
  run: async (payload, { ctx }) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    console.log(`Processed ${data.length} items`);
    return { count: data.length };
  },
});
