import { triggerProgressTask } from "./actions";
import ProgressClient from "./components/ProgressClient";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Real-time Task Dashboard
          </h1>
          <p className="text-gray-600">
            Watch your task progress in real-time
          </p>
        </div>

        <TaskTrigger />
      </div>
    </main>
  );
}

async function TaskTrigger() {
  const result = await triggerProgressTask();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
        Task started! Run ID: {result.runId.slice(0, 8)}...
      </div>

      <ProgressClient
        runId={result.runId}
        publicAccessToken={result.publicAccessToken}
      />
    </div>
  );
}