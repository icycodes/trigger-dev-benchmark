import { NextResponse } from "next/server";
import { runs } from "@trigger.dev/sdk/v3";
import "@/lib/trigger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }

  const run = await runs.retrieve(runId);

  return NextResponse.json({
    id: run.id,
    status: run.status,
    metadata: run.metadata ?? {},
  });
}
