import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.TRIGGER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TRIGGER_API_KEY" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.trigger.dev/api/v3/waitpoints/tokens/${token}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { verified: true } }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to complete verification", details: errorText },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true });
}
