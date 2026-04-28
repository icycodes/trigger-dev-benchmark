import { schedules } from "@trigger.dev/sdk/v3";

export const scheduledSync = schedules.task({
  id: "scheduled-sync-scheduled_sync__n66mBp7",
  cron: "* * * * *",
  run: async (payload) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json() as any[];
    console.log(`Processed ${todos.length} items`);
    return { count: todos.length };
  },
});
