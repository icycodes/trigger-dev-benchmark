"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { startTaskAction } from "./actions";

export default function Home() {
  const [runDetails, setRunDetails] = useState<{ runId: string; publicAccessToken: string } | null>(null);

  const { run, error } = useRealtimeRun(runDetails?.runId, {
    accessToken: runDetails?.publicAccessToken,
    enabled: !!runDetails,
  });

  const handleStartTask = async () => {
    const details = await startTaskAction();
    setRunDetails(details);
  };

  const progress = run?.metadata?.progress as { percentage?: number } | undefined;
  const percentage = progress?.percentage ?? 0;
  const isCompleted = run?.status === "COMPLETED";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Real-time Progress</h1>
        
        <button 
          onClick={handleStartTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Task
        </button>

        {runDetails && (
          <div className="mt-8">
            <p className="mb-2">Status: {run?.status}</p>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-lg font-semibold">{percentage}%</p>
            
            {isCompleted && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md font-bold">
                Task Completed!
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            Error monitoring run: {error.message}
          </div>
        )}
      </div>
    </main>
  );
}
