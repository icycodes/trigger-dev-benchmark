"use client";

import { useState, useEffect, useCallback } from "react";

type OnboardingStatus = {
  runId: string;
  status: string;
  metadata?: {
    status?: string;
    tokenId?: string;
    email?: string;
  };
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const fetchStatus = useCallback(async (runId: string) => {
    try {
      const res = await fetch(`/api/status?runId=${runId}`);
      if (!res.ok) return;
      const data = await res.json();
      setOnboarding((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: data.status,
          metadata: data.metadata,
        };
      });
    } catch {
      // ignore polling errors
    }
  }, []);

  // Poll for status updates every 2 seconds when onboarding is active
  useEffect(() => {
    if (!onboarding?.runId) return;
    const metaStatus = onboarding.metadata?.status;
    // Stop polling if completed/failed/active
    if (
      onboarding.status === "COMPLETED" ||
      onboarding.status === "FAILED" ||
      onboarding.status === "CANCELED" ||
      metaStatus === "Active"
    )
      return;

    const interval = setInterval(() => {
      fetchStatus(onboarding.runId);
    }, 2000);

    return () => clearInterval(interval);
  }, [onboarding, fetchStatus]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVerifyMessage(null);

    try {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setOnboarding({ runId: data.runId, status: "QUEUED", metadata: undefined });
      // Poll immediately for status
      setTimeout(() => fetchStatus(data.runId), 1000);
    } catch {
      setError("Failed to start onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const tokenId = onboarding?.metadata?.tokenId;
    if (!tokenId) return;

    setVerifyLoading(true);
    setVerifyMessage(null);

    try {
      const res = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setVerifyMessage(`Error: ${data.error}`);
        return;
      }

      setVerifyMessage(data.message || "Verification sent!");
      // Resume polling
      if (onboarding?.runId) {
        setTimeout(() => fetchStatus(onboarding.runId), 1500);
      }
    } catch {
      setVerifyMessage("Failed to verify. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleReset = () => {
    setOnboarding(null);
    setEmail("");
    setError(null);
    setVerifyMessage(null);
  };

  const metaStatus = onboarding?.metadata?.status;
  const isWaiting = metaStatus === "Waiting for verification";
  const isActive = metaStatus === "Active";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Durable Onboarding</h1>
          <p className="text-slate-500 mt-1 text-sm">Powered by Trigger.dev Waitpoints</p>
        </div>

        {!onboarding ? (
          /* Sign-up Form */
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? "Starting onboarding..." : "Sign Up"}
            </button>
          </form>
        ) : (
          /* Status Dashboard */
          <div className="space-y-5">
            {/* Run Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Run ID</span>
              <p className="text-xs font-mono text-slate-700 break-all">{onboarding.runId}</p>
            </div>

            {/* Run Status */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Run Status</p>
              <StatusBadge status={onboarding.status} />
            </div>

            {/* Metadata Status */}
            {metaStatus && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Onboarding Status</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : isWaiting
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isActive ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : isWaiting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  {metaStatus}
                </div>
              </div>
            )}

            {/* Verify Button */}
            {isWaiting && onboarding.metadata?.tokenId && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Verification email sent</p>
                    <p className="text-xs text-amber-700 mt-0.5">To: {onboarding.metadata.email || email}</p>
                  </div>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={verifyLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                >
                  {verifyLoading ? "Verifying..." : "🔗 Simulate Email Verification"}
                </button>
                {verifyMessage && (
                  <p className="text-xs text-center text-amber-800">{verifyMessage}</p>
                )}
              </div>
            )}

            {/* Success State */}
            {isActive && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4 text-center">
                <svg className="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-green-800">Onboarding Complete!</p>
                <p className="text-xs text-green-700 mt-1">
                  {onboarding.metadata?.email || email} has been verified and activated.
                </p>
              </div>
            )}

            {/* Polling indicator */}
            {onboarding.status !== "COMPLETED" &&
              onboarding.status !== "FAILED" &&
              !isActive && (
                <p className="text-xs text-center text-slate-400 animate-pulse">
                  Polling for updates every 2 seconds...
                </p>
              )}

            <button
              onClick={handleReset}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    QUEUED: "bg-blue-100 text-blue-800",
    EXECUTING: "bg-blue-100 text-blue-800",
    WAITING_FOR_DEPLOY: "bg-yellow-100 text-yellow-800",
    REATTEMPTING: "bg-orange-100 text-orange-800",
    FROZEN: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-slate-100 text-slate-700",
    FAILED: "bg-red-100 text-red-800",
    CRASHED: "bg-red-100 text-red-800",
    INTERRUPTED: "bg-orange-100 text-orange-800",
    SYSTEM_FAILURE: "bg-red-100 text-red-800",
    DELAYED: "bg-yellow-100 text-yellow-800",
    EXPIRED: "bg-slate-100 text-slate-700",
    TIMED_OUT: "bg-red-100 text-red-800",
    WAITING_TO_RESUME: "bg-purple-100 text-purple-800",
  };
  const colorClass = colors[status] || "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}
