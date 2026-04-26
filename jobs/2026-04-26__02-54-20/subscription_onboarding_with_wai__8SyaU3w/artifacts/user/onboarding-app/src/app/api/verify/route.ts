import { NextRequest, NextResponse } from "next/server";
import { wait } from "@trigger.dev/sdk/v3";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("token");

  if (!tokenId) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  try {
    await wait.completeToken(tokenId, { verified: true, verifiedAt: new Date().toISOString() });

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error completing waitpoint token:", error);
    return NextResponse.json(
      { error: "Failed to complete verification" },
      { status: 500 }
    );
  }
}
