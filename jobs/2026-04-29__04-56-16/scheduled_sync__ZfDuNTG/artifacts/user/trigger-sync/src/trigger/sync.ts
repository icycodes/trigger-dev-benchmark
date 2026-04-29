import { schedules, logger } from "@trigger.dev/sdk/v3";
import { readFileSync } from "node:fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const scheduledSync = schedules.task({
  id: `scheduled-sync-${trialId}`,
  cron: "* * * * *",
  run: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
    }

    const todos = (await response.json()) as unknown[];
    logger.info("Fetched todos from JSONPlaceholder", { count: todos.length });

    return {
      count: todos.length,
    };
  },
});
