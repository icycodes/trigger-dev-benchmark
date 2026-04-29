"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface RunInfo {
  runId: string;
  publicAccessToken: string;
}

interface ProgressMetadata {
  percentage?: number;
}

function ProgressTracker({ runId, publicAccessToken }: RunInfo) {
  const { run, error } = useRealtimeRun(runId, {
    accessToken: publicAccessToken,
  });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Error: {error.message}</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="mt-6 flex items-center gap-3 text-gray-500">
        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        <span>Connecting to task...</span>
      </div>
    );
  }

  const metadata = run.metadata as ProgressMetadata | null;
  const percentage = metadata?.percentage ?? 0;
  const isCompleted = run.status === "COMPLETED";
  const isFailed = run.status === "FAILED" || run.status === "CANCELED";

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Status:{" "}
          <span className="font-semibold text-blue-600">{run.status}</span>
        </span>
        <span className="text-sm font-bold text-gray-800">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
        <div
          className={`h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs font-bold text-white ${
            isCompleted
              ? "bg-green-500"
              : isFailed
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        >
          {percentage >= 20 ? `${percentage}%` : ""}
        </div>
      </div>

      {isCompleted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-700 font-bold text-lg">Task Completed!</p>
            <p className="text-green-600 text-sm">
              The background task finished successfully.
            </p>
          </div>
        </div>
      )}

      {isFailed && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="text-red-700 font-bold text-lg">Task Failed</p>
            <p className="text-red-600 text-sm">
              The background task did not complete successfully.
            </p>
          </div>
        </div>
      )}

      {!isCompleted && !isFailed && (
        <p className="mt-3 text-sm text-gray-500">
          Task is running... updating every second.
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [runInfo, setRunInfo] = useState<RunInfo | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleStartTask = async () => {
    setIsStarting(true);
    setStartError(null);
    setRunInfo(null);

    try {
      const response = await fetch("/api/start-task", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start task");
      }

      setRunInfo({
        runId: data.runId,
        publicAccessToken: data.publicAccessToken,
      });
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Realtime Task Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Powered by Trigger.dev — watch your background task run in real
            time.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartTask}
            disabled={isStarting}
            className={`px-8 py-3 rounded-xl font-semibold text-white text-base transition-all duration-200 shadow-md ${
              isStarting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer"
            }`}
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                Starting...
              </span>
            ) : (
              "▶ Start Task"
            )}
          </button>
        </div>

        {startError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {startError}
          </div>
        )}

        {runInfo && (
          <div className="mt-6 border-t pt-6">
            <p className="text-xs text-gray-400 font-mono mb-4 truncate">
              Run ID: {runInfo.runId}
            </p>
            <ProgressTracker
              runId={runInfo.runId}
              publicAccessToken={runInfo.publicAccessToken}
            />
          </div>
        )}
      </div>
    </main>
  );
}
