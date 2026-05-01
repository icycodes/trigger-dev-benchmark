"use server";

import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { onboardingTask } from "@/trigger/onboarding";

export async function startOnboarding(email: string) {
  const handle = await tasks.trigger<typeof onboardingTask>(
    "onboarding-workflow-subscription_onboarding_with_wai__u3RvCRP",
    { email }
  );

  return { runId: handle.id };
}

export async function getRunStatus(runId: string) {
  const run = await runs.retrieve(runId);
  return {
    status: run.status, // Trigger.dev run status (e.g. COMPLETED, WAITING_FOR_TASK, EXECUTING)
    metadata: run.metadata as Record<string, any> | undefined,
    output: run.output,
  };
}
