import RealtimeProgressClient from "./realtime-progress-client";
import { progressTask } from "@/trigger/progress";

async function startTask() {
  "use server";

  const handle = await progressTask.trigger({
    message: "Dashboard run",
  });

  return {
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  };
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="w-full max-w-xl">
        <RealtimeProgressClient startTask={startTask} />
      </div>
    </div>
  );
}
