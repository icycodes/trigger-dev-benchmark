import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { onboardingWorkflow } from "@/trigger/onboarding";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const handle = await tasks.trigger<typeof onboardingWorkflow>(
      onboardingWorkflow.id,
      { email }
    );

    return NextResponse.json({
      runId: handle.id,
      publicAccessToken: handle.publicAccessToken,
    });
  } catch (error) {
    console.error("Error triggering onboarding workflow:", error);
    return NextResponse.json(
      { error: "Failed to start onboarding workflow" },
      { status: 500 }
    );
  }
}
