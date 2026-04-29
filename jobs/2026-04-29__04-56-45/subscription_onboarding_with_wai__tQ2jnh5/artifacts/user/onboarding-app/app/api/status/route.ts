import { NextRequest, NextResponse } from "next/server";

const TRIAL_ID = process.env.TRIAL_ID || "default";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
    }

    // Fetch the run status from Trigger.dev API
    const apiKey = process.env.TRIGGER_API_KEY;
    const projectRef = process.env.TRIGGER_PROJECT_REF;

    const response = await fetch(
      `https://api.trigger.dev/api/v3/runs/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch run status");
    }

    const data = await response.json();

    return NextResponse.json({
      status: data.status,
      metadata: data.metadata,
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch status",
      },
      { status: 500 }
    );
  }
}