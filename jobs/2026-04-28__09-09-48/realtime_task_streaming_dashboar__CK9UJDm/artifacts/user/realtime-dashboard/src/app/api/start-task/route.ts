import { NextResponse } from "next/server";
import { progressTask } from "@/trigger/progress";
import { auth } from "@trigger.dev/sdk";

export async function POST() {
  try {
    const handle = await progressTask.trigger({});

    // Generate a public access token so the client can subscribe to realtime updates
    const publicToken = await auth.createPublicToken({
      scopes: {
        read: {
          runs: [handle.id],
        },
      },
    });

    return NextResponse.json({
      runId: handle.id,
      publicAccessToken: publicToken,
    });
  } catch (error) {
    console.error("Failed to trigger task:", error);
    return NextResponse.json(
      { error: "Failed to trigger task" },
      { status: 500 }
    );
  }
}
