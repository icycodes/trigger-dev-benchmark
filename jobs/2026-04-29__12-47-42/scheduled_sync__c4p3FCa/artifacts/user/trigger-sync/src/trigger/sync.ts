import { logger, schedules } from "@trigger.dev/sdk/v3";
import fs from "node:fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `scheduled-sync-${trialId}`;

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const scheduledSync = schedules.task({
  id: taskId,
  cron: "* * * * *",
  run: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status}`);
    }

    const todos = (await response.json()) as Todo[];

    logger.info("Processed todos", { count: todos.length });

    return {
      count: todos.length,
    };
  },
});
