import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import type { onboardingWorkflow } from "@/../../trigger/onboarding";

const TRIAL_ID = "subscription_onboarding_with_wai__GojEK8k";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const handle = await tasks.trigger<typeof onboardingWorkflow>(
      `onboarding-workflow-${TRIAL_ID}`,
      { email, trialId: TRIAL_ID }
    );

    return NextResponse.json({ runId: handle.id });
  } catch (error) {
    console.error("Error triggering onboarding workflow:", error);
    return NextResponse.json(
      { error: "Failed to start onboarding workflow" },
      { status: 500 }
    );
  }
}
