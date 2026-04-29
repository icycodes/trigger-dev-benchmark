import { client } from "@trigger.dev/sdk";

// Define the Todo type
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// Create a scheduled task that runs every minute
client.defineJob({
  id: "scheduled-sync-scheduled_sync__XZ6Pex2",
  name: "Scheduled Data Sync",
  version: "1.0.0",
  trigger: {
    schedule: {
      every: "minute",
    },
  },
  run: async (payload, { ctx }) => {
    // Fetch todos from the mock API
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos: Todo[] = await response.json();

    // Log the number of items processed
    await ctx.logger.info(`Processed ${todos.length} todos`);

    return {
      count: todos.length,
      timestamp: new Date().toISOString(),
    };
  },
});