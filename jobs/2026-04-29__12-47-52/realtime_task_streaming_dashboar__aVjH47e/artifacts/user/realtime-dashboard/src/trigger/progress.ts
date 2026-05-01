import { client, task } from "@trigger.dev/sdk/v3";

// Initialize the Trigger.dev client
client.init({
  id: "realtime-dashboard",
});

// Create the task with the trial_id suffix
export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__aVjH47e",
  run: async (payload: any, { ctx }) => {
    // Run for approximately 10 seconds
    for (let i = 0; i <= 10; i++) {
      // Update progress metadata
      ctx.metadata.set("progress", { percentage: i * 10 });

      // Wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      message: "Task completed successfully!",
    };
  },
});