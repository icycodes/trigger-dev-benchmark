"use server";

import { progressTask } from "../trigger/progress";

export async function triggerProgressTask() {
  const handle = await progressTask.trigger({
    message: "Starting progress task",
  });

  return {
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  };
}