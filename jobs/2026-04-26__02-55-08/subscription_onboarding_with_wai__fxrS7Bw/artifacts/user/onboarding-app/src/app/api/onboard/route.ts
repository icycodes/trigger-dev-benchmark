import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const handle = await tasks.trigger(`onboarding-workflow-subscription_onboarding_with_wai__fxrS7Bw`, {
    email,
  });

  return NextResponse.json({ runId: handle.id });
}
