"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { startProgressTask } from "./actions/task";

export default function Dashboard() {
  const [runId, setRunId] = useState<string | null>(null);
  const [publicAccessToken, setPublicAccessToken] = useState<string | null>(null);

  const { run, error } = useRealtimeRun(runId ?? "", {
    accessToken: publicAccessToken ?? "",
    enabled: !!runId && !!publicAccessToken,
  });

  const handleStartTask = async () => {
    const result = await startProgressTask();
    setRunId(result.runId);
    setPublicAccessToken(result.publicAccessToken);
  };

  const progress = run?.metadata?.progress as { percentage: number } | undefined;
  const percentage = progress?.percentage ?? 0;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Task Dashboard
        </h1>

        {!runId ? (
          <button
            onClick={handleStartTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            Start Task
          </button>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700">Progress</span>
                <span className="text-sm font-medium text-blue-700">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">Status: <span className="font-semibold">{run?.status ?? "Starting..."}</span></p>
              {isCompleted && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg font-bold animate-bounce">
                  Task Completed!
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error.message}
              </div>
            )}

            <button
              onClick={() => {
                setRunId(null);
                setPublicAccessToken(null);
              }}
              className="w-full mt-4 text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
