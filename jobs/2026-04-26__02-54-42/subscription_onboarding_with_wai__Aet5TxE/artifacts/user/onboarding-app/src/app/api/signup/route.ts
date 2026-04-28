import { NextResponse } from "next/server";

const TRIGGER_API_URL = "https://api.trigger.dev";
const trialId = "subscription_onboarding_with_wai__Aet5TxE";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body?.email as string | undefined;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const apiKey = process.env.TRIGGER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing TRIGGER_API_KEY" }, { status: 500 });
  }

  const response = await fetch(`${TRIGGER_API_URL}/api/v3/runs/trigger`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: `onboarding-workflow-${trialId}`,
      payload: { email },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to start onboarding", details: data },
      { status: response.status }
    );
  }

  return NextResponse.json({ runId: data.id });
}
