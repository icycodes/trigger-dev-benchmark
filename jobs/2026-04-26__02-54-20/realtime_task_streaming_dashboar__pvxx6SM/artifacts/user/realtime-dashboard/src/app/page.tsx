"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface RunInfo {
  runId: string;
  publicAccessToken: string;
}

interface ProgressMetadata {
  percentage: number;
}

function ProgressTracker({ runInfo }: { runInfo: RunInfo }) {
  const { run, error } = useRealtimeRun(runInfo.runId, {
    accessToken: runInfo.publicAccessToken,
  });

  const metadata = run?.metadata as { progress?: ProgressMetadata } | undefined;
  const percentage = metadata?.progress?.percentage ?? 0;
  const isCompleted = run?.status === "COMPLETED";
  const isFailed =
    run?.status === "FAILED" ||
    run?.status === "CANCELED" ||
    run?.status === "CRASHED" ||
    run?.status === "TIMED_OUT";

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 text-center">
        {isCompleted ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-lg font-semibold">
              ✅ Task Completed!
            </p>
          </div>
        ) : isFailed ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-lg font-semibold">
              ❌ Task Failed (Status: {run?.status})
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm animate-pulse">
            Running... {percentage}% complete
          </p>
        )}
      </div>

      {run && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
          <p>Run ID: {run.id}</p>
          <p>Status: {run.status}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [runInfo, setRunInfo] = useState<RunInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTask = async () => {
    setIsLoading(true);
    setError(null);
    setRunInfo(null);

    try {
      const response = await fetch("/api/trigger-task", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start task");
      }

      const data = await response.json();
      setRunInfo({
        runId: data.runId,
        publicAccessToken: data.publicAccessToken,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-time Task Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Powered by Trigger.dev — watch background tasks run in real-time
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startTask}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Starting...
              </span>
            ) : (
              "Start Task"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        {runInfo && <ProgressTracker runInfo={runInfo} />}
      </div>
    </main>
  );
}
