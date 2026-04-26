"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

import type { progressTask } from "@/trigger/progress";

type RunInfo = {
  runId: string;
  publicAccessToken: string;
};

type ProgressMetadata = {
  progress?: {
    percentage?: number;
  };
};

export default function Home() {
  const [runInfo, setRunInfo] = useState<RunInfo | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { run } = useRealtimeRun<typeof progressTask>(runInfo?.runId, {
    accessToken: runInfo?.publicAccessToken,
    enabled: Boolean(runInfo?.runId && runInfo?.publicAccessToken),
  });

  const progressPercentage =
    ((run?.metadata as ProgressMetadata | undefined)?.progress?.percentage ?? 0) ||
    0;
  const isCompleted = run?.status === "COMPLETED";

  const handleStart = async () => {
    setIsStarting(true);
    setErrorMessage(null);
    setRunInfo(null);

    try {
      const response = await fetch("/api/start-task", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to start task");
      }

      const data = (await response.json()) as RunInfo;
      setRunInfo(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error occurred"
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-10 shadow-xl">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Trigger.dev realtime dashboard
          </p>
          <h1 className="text-3xl font-semibold">Task Progress Monitor</h1>
          <p className="text-sm text-slate-400">
            Start the background job to see its realtime progress updates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isStarting ? "Starting task..." : "Start Task"}
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {runInfo && (
            <p className="text-xs text-slate-500">Run ID: {runInfo.runId}</p>
          )}
        </div>

        {isCompleted && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Task Completed!
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </div>
        )}
      </main>
    </div>
  );
}
