"use client";

import { useState, useEffect, useCallback } from "react";

interface RunStatus {
  id: string;
  status: string;
  metadata: { status?: string } | null;
  createdAt: string;
  finishedAt?: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState("");
  const [runStatus, setRunStatus] = useState<RunStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!runId) return;
    try {
      const res = await fetch(`/api/status?runId=${runId}`);
      if (!res.ok) return;
      const data: RunStatus = await res.json();
      setRunStatus(data);
    } catch {
      // silently ignore polling errors
    }
  }, [runId]);

  // Poll for status updates every 2 seconds when we have a runId
  useEffect(() => {
    if (!runId) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [runId, fetchStatus]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setRunStatus(null);

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to start onboarding");
      }

      const data = await res.json();
      setRunId(data.runId);
      setMessage("Onboarding workflow started! Waiting for email verification...");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!tokenId) return;
    setVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Verification failed");
      }

      setMessage("Email verified! The workflow will now complete.");
      setTokenId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const onboardingStatus = runStatus?.metadata?.status ?? null;
  const isWaitingForVerification = onboardingStatus === "Waiting for verification";
  const isActive = onboardingStatus === "Active";
  const isCompleted = runStatus?.status === "COMPLETED";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">User Onboarding</h1>
          <p className="text-gray-500 text-sm mt-1">Powered by Trigger.dev Waitpoints</p>
        </div>

        {/* Sign-up Form */}
        {!runId && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Starting..." : "Start Onboarding"}
            </button>
          </form>
        )}

        {/* Status Display */}
        {runId && (
          <div className="space-y-4">
            {/* Run ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Run ID</p>
              <p className="text-sm font-mono text-gray-800 break-all">{runId}</p>
            </div>

            {/* Status Badge */}
            {onboardingStatus && (
              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed ${
                isActive || isCompleted ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"
              }`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  isActive || isCompleted
                    ? "bg-green-500"
                    : isWaitingForVerification
                    ? "bg-amber-500 animate-pulse"
                    : "bg-gray-400"
                }`} />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Onboarding Status</p>
                  <p className={`font-semibold ${
                    isActive || isCompleted ? "text-green-700" : "text-amber-700"
                  }`}>
                    {onboardingStatus}
                  </p>
                </div>
              </div>
            )}

            {/* Simulate Email Verification */}
            {isWaitingForVerification && !isActive && !isCompleted && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-amber-800 font-medium">
                  📧 Verification pending
                </p>
                <p className="text-xs text-amber-700">
                  Enter the waitpoint token ID to simulate email verification:
                </p>
                <input
                  type="text"
                  value={tokenId}
                  placeholder="waitpoint_token_..."
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 bg-white"
                />
                <button
                  onClick={handleVerify}
                  disabled={verifying || !tokenId}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                >
                  {verifying ? "Verifying..." : "✓ Simulate Email Verification"}
                </button>
              </div>
            )}

            {/* Completed state */}
            {(isActive || isCompleted) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-green-800 font-semibold">Onboarding Complete!</p>
                <p className="text-green-600 text-sm mt-1">Your account is now active.</p>
              </div>
            )}

            {/* Workflow run status */}
            {runStatus && (
              <div className="text-xs text-gray-400 text-center">
                Workflow status: <span className="font-mono">{runStatus.status}</span>
              </div>
            )}

            {/* Restart button */}
            <button
              onClick={() => {
                setRunId(null);
                setTokenId("");
                setRunStatus(null);
                setEmail("");
                setMessage(null);
                setError(null);
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline transition"
            >
              Start over
            </button>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
