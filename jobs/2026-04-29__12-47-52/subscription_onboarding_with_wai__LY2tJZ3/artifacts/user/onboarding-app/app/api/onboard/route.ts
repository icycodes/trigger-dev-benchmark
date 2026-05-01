import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Trigger the onboarding workflow
    const triggerUrl = `${process.env.TRIGGER_API_URL || "https://api.trigger.dev"}/api/v3/tasks/onboarding-workflow-subscription_onboarding_with_wai__LY2tJZ3/trigger`;

    const triggerResponse = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
      },
      body: JSON.stringify({
        payload: {
          email,
          userId: `user-${Date.now()}`,
        },
      }),
    });

    if (!triggerResponse.ok) {
      const errorText = await triggerResponse.text();
      console.error("Trigger error:", errorText);
      throw new Error(`Failed to trigger workflow: ${errorText}`);
    }

    const triggerData = await triggerResponse.json();

    return NextResponse.json({
      runId: triggerData.runId,
      status: triggerData.status,
      tokenId: triggerData.tokenId,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to start onboarding",
      },
      { status: 500 }
    );
  }
}