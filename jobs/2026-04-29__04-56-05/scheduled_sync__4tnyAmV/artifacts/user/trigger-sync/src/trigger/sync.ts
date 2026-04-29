import { schedules, logger } from "@trigger.dev/sdk/v3";
import { readFileSync } from "fs";

const trial_id = readFileSync("/logs/trial_id", "utf-8").trim();

export const scheduledSync = schedules.task({
  id: `scheduled-sync-${trial_id}`,
  cron: "* * * * *",
  run: async (payload, { ctx }) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos: any = await response.json();
    logger.log(`Fetched ${todos.length} items`);
    return { count: todos.length };
  },
});
