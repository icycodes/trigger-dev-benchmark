import { runs } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "Run ID is required" }, { status: 400 });
  }

  try {
    // We fetch the run details to get status and metadata
    // Using the Trigger.dev SDK to fetch run details
    const run = await runs.retrieve(runId);
    
    // We also need the waitpoint token if it's waiting
    // The SDK doesn't directly expose waitpoints in the run object in a simple way sometimes, 
    // but we can check the run's current state.
    
    return NextResponse.json({
      status: run.status,
      metadata: run.metadata,
      // If the run is suspended, it might have a waitpoint. 
      // In a real app, we might store the token in metadata or fetch it.
      // For this task, we'll assume the user might need to find the token.
      // Actually, wait.createToken doesn't return the token ID in a way that's easily accessible here without storing it.
      // Let's modify the task to store the token in metadata.
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
