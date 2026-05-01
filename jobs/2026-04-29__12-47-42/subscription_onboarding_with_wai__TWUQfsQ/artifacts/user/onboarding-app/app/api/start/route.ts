import { NextResponse } from "next/server";

const trialId = "subscription_onboarding_with_wai__TWUQfsQ";

export async function POST(request: Request) {
  const apiKey = process.env.TRIGGER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TRIGGER_API_KEY" },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { email?: string };

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.trigger.dev/api/v3/tasks/onboarding-workflow-${trialId}/run`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: { email: body.email } }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to start onboarding", details: errorText },
      { status: response.status }
    );
  }

  const data = (await response.json()) as { id?: string; runId?: string };
  const runId = data.runId ?? data.id;

  if (!runId) {
    return NextResponse.json(
      { error: "Run ID missing from Trigger.dev response" },
      { status: 500 }
    );
  }

  return NextResponse.json({ runId });
}
