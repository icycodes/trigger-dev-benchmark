"use client";

import { useState, useEffect, useCallback } from "react";

interface RunData {
  id: string;
  status: string;
  metadata?: {
    status?: string;
    tokenId?: string;
    email?: string;
  };
}

type OnboardingState =
  | { phase: "form" }
  | { phase: "onboarding"; runId: string; email: string; runData: RunData | null }
  | { phase: "complete"; email: string };

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<OnboardingState>({ phase: "form" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const fetchRunStatus = useCallback(async (runId: string) => {
    try {
      const response = await fetch(`/api/status?runId=${runId}`);
      if (!response.ok) return null;
      const data: RunData = await response.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (state.phase !== "onboarding") return;

    const interval = setInterval(async () => {
      const data = await fetchRunStatus(state.runId);
      if (!data) return;

      const metaStatus = data.metadata?.status;

      if (metaStatus === "Active" || data.status === "COMPLETED") {
        clearInterval(interval);
        setState({ phase: "complete", email: state.email });
        return;
      }

      setState((prev) =>
        prev.phase === "onboarding" ? { ...prev, runData: data } : prev
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [state, fetchRunStatus]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to start onboarding");
        return;
      }

      setState({
        phase: "onboarding",
        runId: data.runId,
        email: data.email,
        runData: null,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (state.phase !== "onboarding" || !state.runData?.metadata?.tokenId) return;

    setVerifyLoading(true);
    setVerifyMessage(null);

    try {
      const tokenId = state.runData.metadata.tokenId;
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setVerifyMessage(`Error: ${data.error}`);
      } else {
        setVerifyMessage("✅ Verification sent! Waiting for status update...");
      }
    } catch {
      setVerifyMessage("Network error during verification.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Waiting for verification":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (state.phase === "complete") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
          <p className="text-gray-600 mb-6">
            Your account for <strong>{state.email}</strong> is now active.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">Status: Active ✅</p>
          </div>
          <button
            onClick={() => {
              setState({ phase: "form" });
              setEmail("");
              setVerifyMessage(null);
            }}
            className="mt-6 text-sm text-indigo-600 hover:underline"
          >
            Start another onboarding
          </button>
        </div>
      </main>
    );
  }

  if (state.phase === "onboarding") {
    const metaStatus = state.runData?.metadata?.status;
    const tokenId = state.runData?.metadata?.tokenId;
    const runStatus = state.runData?.status;

    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Onboarding in Progress</h1>
          <p className="text-gray-500 text-sm mb-6">
            Signed up as <strong>{state.email}</strong>
          </p>

          {/* Run Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Run ID</span>
              <span className="text-xs font-mono text-gray-700 bg-gray-200 px-2 py-1 rounded truncate max-w-xs">
                {state.runId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Task Status</span>
              <span className="text-xs font-mono text-gray-700 bg-gray-200 px-2 py-1 rounded">
                {runStatus || "Initializing..."}
              </span>
            </div>
          </div>

          {/* Metadata Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">Onboarding Status</span>
              {!metaStatus && (
                <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeClass(metaStatus)}`}
            >
              {metaStatus || "Starting workflow..."}
            </span>
          </div>

          {/* Verification Section */}
          {metaStatus === "Waiting for verification" && tokenId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-semibold text-yellow-900 mb-2">
                📧 Email Verification Required
              </h2>
              <p className="text-xs text-yellow-700 mb-3">
                Your workflow is paused, waiting for email verification. Click the button below to simulate clicking the verification link.
              </p>
              <button
                onClick={handleVerify}
                disabled={verifyLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {verifyLoading ? "Verifying..." : "✉️ Simulate Email Verification"}
              </button>
              {verifyMessage && (
                <p className="mt-2 text-xs text-yellow-800 font-medium">{verifyMessage}</p>
              )}
            </div>
          )}

          {/* Token ID display */}
          {tokenId && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Waitpoint Token ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">{tokenId}</p>
            </div>
          )}

          {/* Polling indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Polling for status updates every 2 seconds...
          </div>
        </div>
      </main>
    );
  }

  // Sign-up form
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-500 mt-2">
            Sign up to begin your onboarding journey
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "Starting onboarding..." : "Sign Up & Start Onboarding"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          This demo uses Trigger.dev Waitpoints for durable onboarding workflows.
        </p>
      </div>
    </main>
  );
}
