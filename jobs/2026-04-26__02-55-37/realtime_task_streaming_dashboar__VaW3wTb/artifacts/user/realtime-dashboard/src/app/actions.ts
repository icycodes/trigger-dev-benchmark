"use server";
import { progressTask } from "@/trigger/progress";

export async function startTask() {
  const handle = await progressTask.trigger({});
  return {
    id: handle.id,
    publicAccessToken: handle.publicAccessToken,
  };
}
