import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { onboardingWorkflow } from "@/src/trigger/onboarding";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userId = `user_${Date.now()}`;

    const handle = await tasks.trigger(onboardingWorkflow.id, {
      email,
      userId,
    });

    return NextResponse.json({
      runId: handle.id,
      email,
    });
  } catch (error: unknown) {
    console.error("Error starting onboarding:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
