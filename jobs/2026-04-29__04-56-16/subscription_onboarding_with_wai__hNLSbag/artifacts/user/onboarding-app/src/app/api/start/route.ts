import { NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { readTrialId } from "@/lib/trial";
import "@/lib/trigger";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const trialId = readTrialId();
  const taskId = `onboarding-workflow-${trialId}`;
  const handle = await tasks.trigger(taskId, { email: body.email });

  return NextResponse.json({ runId: handle.id });
}
