import { task } from "@trigger.dev/sdk/v3";
import { metadata } from "@trigger.dev/sdk/v3";

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__e5ZAct5",
  run: async () => {
    // Run for approximately 10 seconds, updating progress every second
    for (let i = 0; i <= 10; i++) {
      await metadata.set("progress", { percentage: i * 10 });
      if (i < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return { success: true, message: "Task completed successfully" };
  },
});
