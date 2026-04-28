import { NextRequest, NextResponse } from "next/server";

const TRIAL_ID = "subscription_onboarding_with_wai__FJ64LJJ";

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
    const triggerResponse = await fetch(
      "https://api.trigger.dev/api/v3/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TRIGGER_API_KEY}`,
        },
        body: JSON.stringify({
          event: "user.signup",
          payload: { email },
        }),
      }
    );

    if (!triggerResponse.ok) {
      const errorData = await triggerResponse.json();
      throw new Error(errorData.message || "Failed to trigger workflow");
    }

    const triggerData = await triggerResponse.json();

    // Get the run ID from the response
    const runId = triggerData.runs?.[0]?.id;
    if (!runId) {
      throw new Error("No run ID returned from Trigger.dev");
    }

    // Poll for the run status to get the token ID
    let maxAttempts = 10;
    let attempts = 0;
    let tokenId = null;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const runResponse = await fetch(
        `https://api.trigger.dev/api/v3/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_API_KEY}`,
          },
        }
      );

      if (runResponse.ok) {
        const runData = await runResponse.json();
        tokenId = runData.waitpoints?.[0]?.id;

        if (tokenId) {
          break;
        }
      }

      attempts++;
    }

    return NextResponse.json({
      runId,
      status: "Waiting for verification",
      tokenId,
    });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start onboarding",
      },
      { status: 500 }
    );
  }
}