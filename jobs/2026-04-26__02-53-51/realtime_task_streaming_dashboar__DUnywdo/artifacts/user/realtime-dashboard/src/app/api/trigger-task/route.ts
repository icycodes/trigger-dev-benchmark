import { NextResponse } from "next/server";
import { progressTask } from "@/trigger/progress";

export async function POST() {
  try {
    const handle = await progressTask.trigger({});
    
    return NextResponse.json({
      runId: handle.id,
      publicAccessToken: handle.publicAccessToken,
    });
  } catch (error) {
    console.error("Failed to trigger task:", error);
    return NextResponse.json(
      { error: "Failed to trigger task" },
      { status: 500 }
    );
  }
}