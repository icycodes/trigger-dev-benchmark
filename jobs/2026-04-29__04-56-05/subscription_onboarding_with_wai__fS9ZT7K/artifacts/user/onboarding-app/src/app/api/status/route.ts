import { runs } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
  }

  try {
    const run = await runs.retrieve(runId);
    
    // We also need to find if there are any active waitpoints to get the token
    // The requirements say: "If the status is 'Waiting for verification', show a button/link that sends a POST request to /api/verify?token=${tokenId}"
    // We can try to find the token in the run's waitpoints or metadata if we stored it there.
    // Actually, wait.createToken doesn't automatically put it in metadata.
    // Let's update the task to put the token in metadata so we can easily retrieve it.
    
    return NextResponse.json({
      status: run.status,
      metadata: run.metadata,
    });
  } catch (error) {
    console.error("Failed to retrieve run:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
