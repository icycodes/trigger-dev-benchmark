import { NextRequest, NextResponse } from "next/server";
import { wait } from "@trigger.dev/sdk";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("token");

    if (!tokenId) {
      return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
    }

    // Complete the waitpoint token using the Trigger.dev SDK
    await wait.completeToken(tokenId, {
      data: { verified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in verify route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to verify email",
      },
      { status: 500 }
    );
  }
}