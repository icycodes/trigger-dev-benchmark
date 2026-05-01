"use client";

import { useState, useEffect } from "react";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const startOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setRunId(data.runId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string) => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/verify?token=${token}`, {
        method: "POST",
      });
      await res.json();
      // Polling will update the status
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?runId=${runId}`);
        const data = await res.json();
        setStatus(data);
        if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "CANCELED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-blue-600">User Onboarding</h1>

        {!runId ? (
          <form onSubmit={startOnboarding} className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Starting..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Onboarding in Progress</h2>
            <div className="text-sm text-gray-600">
              <p><strong>Run ID:</strong> {runId}</p>
              <p><strong>Status:</strong> {status?.status || "Initializing..."}</p>
              <p><strong>App Status:</strong> {status?.metadata?.status || "N/A"}</p>
            </div>

            {status?.metadata?.status === "Waiting for verification" && status?.metadata?.verificationToken && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700 mb-2">Verification Email Sent (Simulated)</p>
                <button
                  onClick={() => verifyToken(status.metadata.verificationToken)}
                  disabled={verifying}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {verifying ? "Verifying..." : "Simulate Email Verification"}
                </button>
              </div>
            )}

            {status?.metadata?.status === "Active" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-bold">✓ Onboarding Complete!</p>
                <p className="text-green-600">Your account is now active.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
