"use client";

import { useState } from "react";

interface RunMetadata {
  status: string;
  email?: string;
  verifiedAt?: string;
}

interface TriggerRun {
  id: string;
  status: string;
  metadata?: RunMetadata;
}

const TRIAL_ID = "subscription_onboarding_with_wai__FJ64LJJ";

export default function OnboardingForm() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollStatus = async (currentRunId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/run-status?runId=${currentRunId}`);
        if (!response.ok) return;

        const data: TriggerRun = await response.json();
        const runStatus = data.metadata?.status || data.status;

        setStatus(runStatus);

        if (runStatus === "Active") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    }, 2000);

    return interval;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start onboarding");
      }

      const data = await response.json();
      setRunId(data.runId);
      setStatus(data.status);
      setTokenId(data.tokenId);

      // Start polling for status updates
      pollStatus(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!tokenId) return;

    try {
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to verify email");
      }

      // Status will be updated by polling
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Onboarding
        </h1>
        <p className="text-gray-600 mb-6">
          Sign up to start the onboarding process with Trigger.dev Waitpoints
        </p>

        {!runId ? (
          <form onSubmit={handleSignup} className="space-y-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Starting..." : "Start Onboarding"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                Onboarding Status
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Run ID:</span>
                  <span className="text-sm font-mono text-blue-900">{runId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Email:</span>
                  <span className="text-sm text-blue-900">{email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Status:</span>
                  <span className="text-sm font-semibold text-blue-900">
                    {status || "Loading..."}
                  </span>
                </div>
              </div>
            </div>

            {status === "Waiting for verification" && tokenId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-yellow-900 mb-3">
                  Action Required
                </h2>
                <p className="text-sm text-yellow-700 mb-4">
                  Simulate email verification by clicking the button below:
                </p>
                <button
                  onClick={handleVerify}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Simulate Email Verification
                </button>
              </div>
            )}

            {status === "Active" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-green-900 mb-2">
                  Onboarding Complete!
                </h2>
                <p className="text-sm text-green-700">
                  Your account has been successfully verified and activated.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={() => {
                setRunId(null);
                setStatus(null);
                setTokenId(null);
                setError(null);
              }}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Start New Onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  );
}