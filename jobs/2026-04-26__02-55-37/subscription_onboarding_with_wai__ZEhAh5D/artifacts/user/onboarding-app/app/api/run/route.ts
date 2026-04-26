import { NextRequest, NextResponse } from "next/server";
import { runs } from "@trigger.dev/sdk/v3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }

  try {
    const run = await runs.retrieve(runId);
    return NextResponse.json(run);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
