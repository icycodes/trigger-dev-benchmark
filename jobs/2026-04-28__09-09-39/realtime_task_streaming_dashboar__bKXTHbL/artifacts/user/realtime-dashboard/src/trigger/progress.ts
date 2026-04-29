import { task, wait, metadata } from "@trigger.dev/sdk/v3";

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__bKXTHbL",
  run: async (payload: { duration?: number }) => {
    const duration = payload.duration ?? 10;
    
    for (let i = 0; i <= 10; i++) {
      const percentage = i * 10;
      await metadata.set("progress", { percentage });
      
      if (i < 10) {
        await wait.for({ seconds: 1 });
      }
    }

    return { completed: true };
  },
});
