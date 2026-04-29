import { NextRequest, NextResponse } from "next/server";
import { client } from "@/trigger";

const TRIAL_ID = process.env.TRIAL_ID || "default";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Trigger the onboarding workflow
    const result = await client.sendEvent({
      name: "onboarding.started",
      payload: { email },
    });

    if (!result) {
      throw new Error("Failed to trigger onboarding workflow");
    }

    return NextResponse.json({
      runId: result.id,
      message: "Onboarding started successfully",
    });
  } catch (error) {
    console.error("Error starting onboarding:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to start onboarding",
      },
      { status: 500 }
    );
  }
}