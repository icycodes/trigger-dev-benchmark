"use client";

import { useState, useTransition } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import type { progressTask } from "@/trigger/progress";

type StartTaskResult = {
  runId: string;
  publicAccessToken: string;
};

type RealtimeProgressClientProps = {
  startTask: () => Promise<StartTaskResult>;
};

export default function RealtimeProgressClient({
  startTask,
}: RealtimeProgressClientProps) {
  const [handle, setHandle] = useState<StartTaskResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { run, error } = useRealtimeRun<typeof progressTask>(handle?.runId, {
    accessToken: handle?.publicAccessToken,
    enabled: Boolean(handle?.runId),
  });

  const progress =
    (run?.metadata as { progress?: { percentage?: number } } | undefined)
      ?.progress?.percentage ?? 0;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Real-time Task Streaming
        </h1>
        <p className="text-sm text-zinc-500">
          Trigger a 10 second background task and watch progress updates live.
        </p>
      </div>

      <button
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        onClick={() => {
          startTransition(async () => {
            const newHandle = await startTask();
            setHandle(newHandle);
          });
        }}
        disabled={isPending}
        type="button"
      >
        {isPending ? "Starting task..." : "Start Task"}
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-zinc-600">
        {handle ? (
          <span>Status: {run?.status ?? "Connecting..."}</span>
        ) : (
          <span>Click start to begin tracking progress.</span>
        )}
      </div>

      {isCompleted && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Task Completed!
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message}
        </div>
      )}
    </div>
  );
}
