import { NextResponse } from "next/server";
import { wait } from "@trigger.dev/sdk/v3";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    await wait.completeToken(token, { verified: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing token:", error);
    return NextResponse.json({ error: "Failed to complete token" }, { status: 500 });
  }
}
