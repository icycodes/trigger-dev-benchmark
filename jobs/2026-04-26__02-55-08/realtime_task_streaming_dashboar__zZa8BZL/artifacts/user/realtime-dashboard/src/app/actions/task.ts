"use server";

import { progressTask } from "@/trigger/progress";

export async function startProgressTask() {
  const handle = await progressTask.trigger({});
  
  return {
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  };
}
