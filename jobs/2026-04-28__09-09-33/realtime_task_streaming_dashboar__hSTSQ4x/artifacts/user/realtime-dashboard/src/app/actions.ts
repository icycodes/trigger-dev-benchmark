"use server";

import { progressTask } from "@/trigger/progress";

export async function triggerProgressTask() {
  const handle = await progressTask.trigger({});
  return {
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  };
}
