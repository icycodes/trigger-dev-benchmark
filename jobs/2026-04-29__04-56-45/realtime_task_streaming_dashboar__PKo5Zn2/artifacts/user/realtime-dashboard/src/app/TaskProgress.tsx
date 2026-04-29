"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { startProgressTask } from "./actions";

export default function TaskProgress() {
  const [runId, setRunId] = useState<string | null>(null);
  const [publicAccessToken, setPublicAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { run, isFetching } = useRealtimeRun(runId, publicAccessToken);

  const handleStartTask = async () => {
    setLoading(true);
    try {
      const result = await startProgressTask();
      setRunId(result.runId);
      setPublicAccessToken(result.publicAccessToken);
    } catch (error) {
      console.error("Failed to start task:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = run?.metadata?.progress?.percentage ?? 0;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <div className="flex flex-col items-center gap-8 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-black dark:text-white">
        Real-time Task Dashboard
      </h1>

      <button
        onClick={handleStartTask}
        disabled={loading || runId !== null}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Starting..." : runId ? "Task Running..." : "Start Task"}
      </button>

      {runId && (
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {isCompleted && (
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                Task Completed!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {run.output?.message}
              </p>
            </div>
          )}
          {isFetching && !isCompleted && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Waiting for updates...
            </p>
          )}
        </div>
      )}
    </div>
  );
}