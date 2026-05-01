import { onboardingWorkflow } from "@/trigger/onboarding";
import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const run = await tasks.trigger<typeof onboardingWorkflow>(
    "onboarding-workflow-subscription_onboarding_with_wai__izsdAZ8",
    { email }
  );

  return NextResponse.json({ runId: run.id });
}
