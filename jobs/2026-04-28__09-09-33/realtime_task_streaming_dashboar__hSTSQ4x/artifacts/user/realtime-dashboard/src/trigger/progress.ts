import { task, metadata } from "@trigger.dev/sdk/v3";

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__hSTSQ4x",
  run: async (payload: any) => {
    for (let i = 0; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      metadata.set("progress", { percentage: i * 10 });
    }
  },
});
