import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.TRIGGER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TRIGGER_API_KEY" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const runId = url.searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }

  const response = await fetch(`https://api.trigger.dev/api/v3/runs/${runId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to fetch run status", details: errorText },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    status: data.status,
    metadata: data.metadata ?? {},
  });
}
