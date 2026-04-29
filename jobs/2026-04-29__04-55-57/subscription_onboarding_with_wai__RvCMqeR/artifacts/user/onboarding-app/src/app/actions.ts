"use server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { onboardingWorkflow } from "../trigger/onboarding";

export async function triggerOnboarding(email: string) {
  const run = await tasks.trigger<typeof onboardingWorkflow>(
    "onboarding-workflow-subscription_onboarding_with_wai__RvCMqeR",
    { email }
  );

  return run.id;
}

export async function getRunStatus(runId: string) {
  const run = await runs.retrieve(runId);
  return {
    status: run.status,
    metadata: run.metadata,
  };
}
