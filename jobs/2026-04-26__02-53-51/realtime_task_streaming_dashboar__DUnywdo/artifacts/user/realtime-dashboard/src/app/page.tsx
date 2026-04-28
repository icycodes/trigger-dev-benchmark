"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface TaskProgressProps {
  runId: string;
  publicAccessToken: string;
}

function TaskProgress({ runId, publicAccessToken }: TaskProgressProps) {
  const { run, error } = useRealtimeRun(runId, publicAccessToken);

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!run) {
    return <div>Loading...</div>;
  }

  const percentage = run.output?.metadata?.progress?.percentage || 0;

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Status: <span className="font-medium">{run.status}</span>
      </div>
      {run.status === "COMPLETED" && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
          Task Completed!
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [runInfo, setRunInfo] = useState<{ runId: string; publicAccessToken: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartTask = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/trigger-task", {
        method: "POST",
      });
      const data = await response.json();
      setRunInfo(data);
    } catch (error) {
      console.error("Failed to start task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Real-time Task Dashboard
        </h1>
        
        {!runInfo ? (
          <div className="flex justify-center">
            <button
              onClick={handleStartTask}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Starting..." : "Start Task"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <TaskProgress
              runId={runInfo.runId}
              publicAccessToken={runInfo.publicAccessToken}
            />
          </div>
        )}
      </div>
    </main>
  );
}