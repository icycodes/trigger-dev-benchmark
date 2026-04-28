import { task, wait, metadata } from "@trigger.dev/sdk";

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__zZa8BZL",
  run: async (payload: { name?: string }) => {
    for (let i = 0; i <= 10; i++) {
      await metadata.set("progress", { percentage: i * 10 });
      if (i < 10) {
        await wait.for({ seconds: 1 });
      }
    }

    return {
      message: "Task completed successfully!",
    };
  },
});
