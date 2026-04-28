import { task, metadata } from "@trigger.dev/sdk";

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__VaW3wTb",
  run: async (payload: any) => {
    for (let i = 0; i <= 10; i++) {
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      metadata.set("progress", { percentage: i * 10 });
    }
    return { success: true };
  },
});
