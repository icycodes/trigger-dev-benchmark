import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
    }

    // Fetch the run status from Trigger.dev
    const triggerUrl = `${process.env.TRIGGER_API_URL || "https://api.trigger.dev"}/api/v3/runs/${runId}`;

    const triggerResponse = await fetch(triggerUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
      },
    });

    if (!triggerResponse.ok) {
      throw new Error("Failed to fetch run status");
    }

    const triggerData = await triggerResponse.json();

    return NextResponse.json({
      id: triggerData.id,
      status: triggerData.status,
      metadata: triggerData.metadata || {},
    });
  } catch (error) {
    console.error("Status fetch error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch status",
      },
      { status: 500 }
    );
  }
}