import { metadata, task } from "@trigger.dev/sdk";

type ProgressPayload = {
  message?: string;
};

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__6W7CZji",
  run: async (_payload: ProgressPayload) => {
    for (let i = 0; i <= 10; i += 1) {
      await metadata.set("progress", { percentage: i * 10 });

      if (i < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return { status: "completed" };
  },
});
