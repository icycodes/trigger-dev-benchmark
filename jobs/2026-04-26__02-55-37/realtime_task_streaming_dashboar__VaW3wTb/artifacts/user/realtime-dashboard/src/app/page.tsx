"use client";

import { useState } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { startTask } from "./actions";

export default function Home() {
  const [runDetails, setRunDetails] = useState<{ id: string; publicAccessToken: string } | null>(null);

  const { run, error } = useRealtimeRun(
    runDetails?.id ?? "",
    {
      accessToken: runDetails?.publicAccessToken,
      enabled: !!runDetails,
    }
  );

  const handleStart = async () => {
    const details = await startTask();
    setRunDetails(details);
  };

  const isCompleted = run?.status === "COMPLETED";
  const progress = (run?.metadata?.progress as any)?.percentage ?? 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Real-time Task Progress</h1>
      
      {!runDetails ? (
        <button
          onClick={handleStart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Task
        </button>
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-between">
            <span>Status: {run?.status ?? "Starting..."}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {isCompleted && (
            <div className="text-green-500 font-bold text-center mt-4">
              Task Completed!
            </div>
          )}
          
          {error && (
            <div className="text-red-500 font-bold text-center mt-4">
              Error: {error.message}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
