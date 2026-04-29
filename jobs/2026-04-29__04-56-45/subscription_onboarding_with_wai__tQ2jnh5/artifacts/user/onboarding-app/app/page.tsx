"use client";

import { useState } from "react";

interface RunMetadata {
  status?: string;
  email?: string;
  tokenId?: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start onboarding");
      }

      setRunId(data.runId);
      setStatus("Starting...");
      // Start polling for status
      pollStatus(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const pollStatus = async (currentRunId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/status?runId=${currentRunId}`);
        const data = await response.json();

        if (data.metadata) {
          setStatus(data.metadata.status || "Unknown");
          setTokenId(data.metadata.tokenId || null);
        }

        // Continue polling if status is "Waiting for verification"
        if (data.metadata?.status === "Waiting for verification") {
          setTimeout(poll, 2000); // Poll every 2 seconds
        }
      } catch (err) {
        console.error("Error polling status:", err);
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  const handleVerify = async () => {
    if (!tokenId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify");
      }

      // Continue polling for the final status
      if (runId) {
        pollStatus(runId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              User Onboarding
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign up and complete your verification with Trigger.dev Waitpoints
            </p>
          </div>

          {!runId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? "Starting Onboarding..." : "Start Onboarding"}
              </button>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Onboarding Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Run ID:</span>
                    <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {runId.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Email:</span>
                    <span className="text-gray-900 dark:text-white">{email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span
                      className={`font-semibold ${
                        status === "Active"
                          ? "text-green-600 dark:text-green-400"
                          : status === "Waiting for verification"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {status || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>

              {status === "Waiting for verification" && tokenId && (
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? "Verifying..." : "Simulate Email Verification"}
                </button>
              )}

              {status === "Active" && (
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                    Onboarding Complete!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your account has been successfully verified and activated.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={() => {
                  setRunId(null);
                  setStatus(null);
                  setTokenId(null);
                  setError(null);
                }}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
              >
                Start New Onboarding
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by Trigger.dev Waitpoints</p>
        </div>
      </div>
    </div>
  );
}