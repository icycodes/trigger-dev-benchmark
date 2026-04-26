"use server";

import { onboardingTask } from "@/trigger/onboarding";

export async function startOnboarding(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) throw new Error("Email is required");

  // Trigger the task
  const handle = await onboardingTask.trigger({
    email,
  });

  return { runId: handle.id };
}
