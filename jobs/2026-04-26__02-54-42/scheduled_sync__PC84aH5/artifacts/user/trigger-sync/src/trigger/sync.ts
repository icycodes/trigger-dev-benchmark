import { schedules } from "@trigger.dev/sdk/v3";
import { readFileSync } from "node:fs";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const scheduledSync = schedules.task({
  id: `scheduled-sync-${trialId}`,
  cron: "* * * * *",
  run: async (_payload, { logger }) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
    }

    const todos: Array<{ id: number }> = await response.json();

    logger.info("Fetched todos", { count: todos.length });

    return {
      count: todos.length,
    };
  },
});
