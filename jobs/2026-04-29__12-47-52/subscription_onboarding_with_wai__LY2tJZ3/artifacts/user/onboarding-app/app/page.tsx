"use client";

import { useState, useEffect } from "react";

interface RunMetadata {
  status: string;
  email?: string;
  tokenId?: string;
  startedAt?: string;
  verifiedAt?: string;
}

interface TriggerRun {
  id: string;
  status: string;
  metadata: RunMetadata;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to start onboarding");
      }

      const data = await response.json();
      setRunId(data.runId);
      setStatus(data.status || "pending");
      setTokenId(data.tokenId || null);
      setPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!runId || !polling) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?runId=${runId}`);
        if (!response.ok) return;

        const data: TriggerRun = await response.json();
        setStatus(data.status);

        if (data.metadata?.tokenId) {
          setTokenId(data.metadata.tokenId);
        }

        // Stop polling if status is "Active" or "completed"
        if (
          data.status === "SUCCESS" ||
          data.metadata?.status === "Active" ||
          data.status === "COMPLETED"
        ) {
          setPolling(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [runId, polling]);

  const handleVerify = async () => {
    if (!tokenId) return;

    try {
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete verification");
      }

      const data = await response.json();
      console.log("Verification completed:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const getStatusColor = () => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status === "Active" || status === "SUCCESS" || status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    }
    if (status === "Waiting for verification" || status === "EXECUTING") {
      return "bg-yellow-100 text-yellow-800";
    }
    if (status === "FAILED") {
      return "bg-red-100 text-red-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = () => {
    if (!status) return "Not started";
    if (status === "Active" || status === "SUCCESS" || status === "COMPLETED") {
      return "Active - Onboarding Complete";
    }
    if (status === "Waiting for verification" || status === "EXECUTING") {
      return "Waiting for email verification...";
    }
    if (status === "FAILED") {
      return "Failed";
    }
    return status;
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Onboarding
          </h1>
          <p className="text-gray-600 mb-8">
            Sign up to start your onboarding process with email verification
          </p>

          {!runId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Starting onboarding..." : "Start Onboarding"}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Onboarding Status
                </h3>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                  >
                    {getStatusText()}
                  </span>
                  {polling && (
                    <span className="text-sm text-gray-500">Updating...</span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Run ID
                </h3>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {runId}
                </code>
              </div>

              {status === "Waiting for verification" ||
              status === "EXECUTING" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Email Verification Required
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    A verification link would be sent to your email. For this
                    demo, click the button below to simulate email verification.
                  </p>
                  <button
                    onClick={handleVerify}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition"
                  >
                    Simulate Email Verification
                  </button>
                </div>
              ) : null}

              {(status === "Active" ||
                status === "SUCCESS" ||
                status === "COMPLETED") && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    🎉 Onboarding Complete!
                  </h3>
                  <p className="text-green-700">
                    Your account has been successfully verified and activated.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setRunId(null);
                  setStatus("");
                  setTokenId(null);
                  setPolling(false);
                  setError(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Start New Onboarding
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Powered by Trigger.dev Waitpoints - Durable workflow orchestration
          </p>
        </div>
      </div>
    </main>
  );
}