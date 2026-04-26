import { NextResponse } from "next/server";

const TRIGGER_API_URL = "https://api.trigger.dev";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("token");

  if (!tokenId) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const apiKey = process.env.TRIGGER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing TRIGGER_API_KEY" }, { status: 500 });
  }

  const response = await fetch(
    `${TRIGGER_API_URL}/api/v1/waitpoints/tokens/${tokenId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { verified: true } }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to complete waitpoint", details: data },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, waitpoint: data });
}
