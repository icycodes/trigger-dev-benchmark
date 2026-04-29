import { NextResponse } from "next/server";
import { wait } from "@trigger.dev/sdk/v3";
import "@/lib/trigger";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("token");

  if (!tokenId) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  await wait.completeToken(tokenId, { verified: true });

  return NextResponse.json({ success: true });
}
