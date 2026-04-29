"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { startTaskAction } from "./actions/startTask";

export default function Dashboard() {
  const [runDetails, setRunDetails] = useState<{
    runId: string;
    publicAccessToken: string;
  } | null>(null);

  const { run, error } = useRealtimeRun(runDetails?.runId ?? "", {
    accessToken: runDetails?.publicAccessToken ?? "",
    enabled: !!runDetails,
  });

  const handleStartTask = async () => {
    const details = await startTaskAction();
    setRunDetails(details);
  };

  const progress = run?.metadata?.progress as { percentage: number } | undefined;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold">Task Progress Dashboard</h1>

        <button
          onClick={handleStartTask}
          disabled={!!runDetails && !isCompleted}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {runDetails && !isCompleted ? "Task Running..." : "Start Task"}
        </button>

        {runDetails && (
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress?.percentage ?? 0}%` }}
            ></div>
          </div>
        )}

        {runDetails && (
          <p className="text-xl">
            Progress: {progress?.percentage ?? 0}%
          </p>
        )}

        {isCompleted && (
          <div className="text-green-500 text-2xl font-bold animate-bounce">
            Task Completed!
          </div>
        )}

        {error && (
          <div className="text-red-500">
            Error: {error.message}
          </div>
        )}
      </div>
    </main>
  );
}
