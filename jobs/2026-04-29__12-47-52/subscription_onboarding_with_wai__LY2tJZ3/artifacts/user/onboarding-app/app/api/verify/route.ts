import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("token");

    if (!tokenId) {
      return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
    }

    // Complete the waitpoint token using Trigger.dev API
    const triggerUrl = `${process.env.TRIGGER_API_URL || "https://api.trigger.dev"}/api/v3/waits/tokens/${tokenId}/complete`;

    const triggerResponse = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
      },
      body: JSON.stringify({
        data: {
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      }),
    });

    if (!triggerResponse.ok) {
      const errorText = await triggerResponse.text();
      console.error("Token completion error:", errorText);
      throw new Error(`Failed to complete token: ${errorText}`);
    }

    const triggerData = await triggerResponse.json();

    return NextResponse.json({
      success: true,
      message: "Token completed successfully",
      data: triggerData,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to complete verification",
      },
      { status: 500 }
    );
  }
}