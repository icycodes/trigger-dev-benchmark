"use client";

import { useState, useEffect } from "react";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.runId) {
        setRunId(data.runId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!metadata?.verificationToken) return;
    setLoading(true);
    try {
      await fetch(`/api/verify?token=${metadata.verificationToken}`, {
        method: "POST",
      });
      // Refresh status immediately
      fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    if (!runId) return;
    try {
      const res = await fetch(`/api/status?runId=${runId}`);
      const data = await res.json();
      setStatus(data.status);
      setMetadata(data.metadata);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (runId && metadata?.status !== "Active") {
      interval = setInterval(fetchStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [runId, metadata]);

  return (
    <main className="min-h-screen p-24 flex flex-col items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm border p-8 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 font-sans">User Onboarding</h1>

        {!runId ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-sans">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-sans"
            >
              {loading ? "Starting..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-gray-100 rounded-md overflow-auto">
              <p className="text-xs text-gray-500 mb-1 font-sans">RUN ID</p>
              <p className="font-bold truncate text-black">{runId}</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-sans">Status</p>
              <div className={`px-4 py-2 rounded-full text-white font-bold font-sans ${
                metadata?.status === "Active" ? "bg-green-500" : "bg-yellow-500"
              }`}>
                {metadata?.status || status}
              </div>
            </div>

            {metadata?.status === "Waiting for verification" && (
              <div className="mt-4 p-4 border-2 border-dashed border-indigo-200 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-4 font-sans">Please verify your email to continue.</p>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-sans"
                >
                  {loading ? "Verifying..." : "Simulate Email Verification"}
                </button>
              </div>
            )}

            {metadata?.status === "Active" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-medium font-sans">Onboarding Complete!</p>
                <p className="text-sm text-green-600 font-sans">Your account is now active.</p>
              </div>
            )}

            <button
              onClick={() => { setRunId(null); setMetadata(null); setStatus("Idle"); setEmail(""); }}
              className="w-full text-gray-400 hover:text-gray-600 text-xs font-sans mt-4"
            >
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
