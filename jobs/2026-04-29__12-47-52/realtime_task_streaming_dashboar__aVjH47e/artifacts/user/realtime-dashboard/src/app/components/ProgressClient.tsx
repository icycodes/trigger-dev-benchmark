"use client";

import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface ProgressClientProps {
  runId: string;
  publicAccessToken: string;
}

export default function ProgressClient({ runId, publicAccessToken }: ProgressClientProps) {
  const { run, error } = useRealtimeRun(runId, publicAccessToken);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (!run) {
    return (
      <div className="p-4 bg-gray-100 text-gray-700 rounded-lg">
        Loading...
      </div>
    );
  }

  const progress = run.metadata?.progress as { percentage: number } | undefined;
  const percentage = progress?.percentage ?? 0;
  const isCompleted = run.status === "COMPLETED";

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Task Progress
          </span>
          <span className="text-sm font-bold text-gray-900">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {isCompleted && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg font-medium">
          Task Completed!
        </div>
      )}

      <div className="text-xs text-gray-500">
        Status: {run.status}
      </div>
    </div>
  );
}