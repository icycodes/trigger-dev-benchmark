"use client";

import { useState } from "react";
import { triggerProgressTask } from "./actions";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

export default function Home() {
  const [runId, setRunId] = useState<string | null>(null);
  const [publicAccessToken, setPublicAccessToken] = useState<string | null>(null);

  const { run, error } = useRealtimeRun(runId || "", {
    accessToken: publicAccessToken || "",
    enabled: !!runId && !!publicAccessToken,
  });

  const handleStartTask = async () => {
    const result = await triggerProgressTask();
    setRunId(result.runId);
    setPublicAccessToken(result.publicAccessToken);
  };

  const progress = run?.metadata?.progress as { percentage?: number } | undefined;
  const percentage = progress?.percentage || 0;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Trigger.dev Real-time Task</h1>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={handleStartTask}
            disabled={!!runId && !isCompleted}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Task
          </button>
        </div>

        {runId && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="text-center mt-4">
              {isCompleted ? (
                <span className="text-green-600 font-semibold">Task Completed!</span>
              ) : (
                <span className="text-gray-500">Task is running...</span>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                Error: {error?.message}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
