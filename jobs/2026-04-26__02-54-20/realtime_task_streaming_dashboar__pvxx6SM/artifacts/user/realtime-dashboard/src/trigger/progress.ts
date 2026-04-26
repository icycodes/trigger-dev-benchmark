import { task, metadata, wait } from "@trigger.dev/sdk";

const TRIAL_ID = "realtime_task_streaming_dashboar__pvxx6SM";

export const progressTask = task({
  id: `realtime-progress-task-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: Record<string, unknown>) => {
    // Run for approximately 10 seconds, updating progress every second
    for (let i = 0; i <= 10; i++) {
      const percentage = i * 10;
      await metadata.set("progress", { percentage });

      if (i < 10) {
        await wait.for({ seconds: 1 });
      }
    }

    return { success: true, message: "Task completed!" };
  },
});
