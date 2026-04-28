import { client, task } from "@trigger.dev/sdk/v3";

client.init({
  id: "realtime-dashboard",
});

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__DUnywdo",
  run: async (payload: any, { ctx, metadata }) => {
    // Update progress every second from 0% to 100%
    for (let i = 0; i <= 10; i++) {
      await metadata.set("progress", { percentage: i * 10 });
      
      // Wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    return { success: true };
  },
});