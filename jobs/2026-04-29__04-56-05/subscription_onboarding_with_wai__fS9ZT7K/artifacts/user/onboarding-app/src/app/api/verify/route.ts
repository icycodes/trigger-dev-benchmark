import { wait } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    // Complete the token using wait.completeToken
    await wait.completeToken(token, { data: { verified: true } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to complete token:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
