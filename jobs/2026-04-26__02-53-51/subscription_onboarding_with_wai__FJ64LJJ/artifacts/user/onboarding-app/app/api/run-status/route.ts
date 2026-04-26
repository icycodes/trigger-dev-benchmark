import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.trigger.dev/api/v3/runs/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TRIGGER_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch run status");
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      status: data.status,
      metadata: data.metadata,
    });
  } catch (error) {
    console.error("Error in run-status route:", error);
    return NextResponse.json(
      { error: "Failed to fetch run status" },
      { status: 500 }
    );
  }
}