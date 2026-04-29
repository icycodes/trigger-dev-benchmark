import { trigger } from "@trigger.dev/sdk/v3";
import { onboardingTask } from "@/trigger/onboarding";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const handle = await onboardingTask.trigger({ email });
    return NextResponse.json({ runId: handle.id });
  } catch (error) {
    console.error("Failed to trigger task:", error);
    return NextResponse.json({ error: "Failed to start onboarding" }, { status: 500 });
  }
}
