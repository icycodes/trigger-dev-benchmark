import { NextResponse } from "next/server";

const TRIGGER_API_URL = "https://api.trigger.dev";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }

  const apiKey = process.env.TRIGGER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing TRIGGER_API_KEY" }, { status: 500 });
  }

  const response = await fetch(`${TRIGGER_API_URL}/api/v3/runs/${runId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch run", details: data },
      { status: response.status }
    );
  }

  return NextResponse.json({
    status: data.status,
    metadata: data.metadata ?? {},
  });
}
