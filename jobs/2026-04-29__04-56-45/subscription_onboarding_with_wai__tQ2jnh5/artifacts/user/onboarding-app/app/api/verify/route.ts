import { NextRequest, NextResponse } from "next/server";
import { wait } from "@trigger.dev/sdk";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("token");

    if (!tokenId) {
      return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
    }

    // Complete the waitpoint token
    await wait.completeToken(tokenId, {
      data: { verified: true, timestamp: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      message: "Token completed successfully",
    });
  } catch (error) {
    console.error("Error completing token:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to complete token",
      },
      { status: 500 }
    );
  }
}