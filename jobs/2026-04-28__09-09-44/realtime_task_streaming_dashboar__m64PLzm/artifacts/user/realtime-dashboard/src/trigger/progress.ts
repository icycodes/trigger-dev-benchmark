import { task } from "@trigger.dev/sdk";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const progressTask = task({
  id: "realtime-progress-task-realtime_task_streaming_dashboar__m64PLzm",
  run: async (payload: { message?: string }, { metadata }) => {
    for (let i = 0; i <= 10; i += 1) {
      metadata.set("progress", { percentage: i * 10 });

      if (i < 10) {
        await sleep(1000);
      }
    }

    return {
      message: payload.message ?? "Task complete",
    };
  },
});
