import { NextResponse } from "next/server";

import { progressTask } from "@/trigger/progress";

export async function POST() {
  const handle = await progressTask.trigger({});

  return NextResponse.json({
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  });
}
