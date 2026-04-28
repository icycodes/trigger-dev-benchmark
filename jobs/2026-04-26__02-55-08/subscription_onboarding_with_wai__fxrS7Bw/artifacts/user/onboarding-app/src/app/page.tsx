"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Not started");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setRunId(data.runId);
      setStatus("Triggered");
    } catch (err) {
      console.error(err);
      setStatus("Error starting onboarding");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!tokenId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });
      if (res.ok) {
        setStatus("Verification sent");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://api.trigger.dev/api/v3/runs/${runId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIGGER_SECRET_KEY}`,
          },
        });
        const data = await res.json();
        
        if (data.metadata?.status) {
          setStatus(data.metadata.status);
        } else {
          setStatus(data.status);
        }

        // Check for waitpoint token in the run's waitpoints
        const wpRes = await fetch(`https://api.trigger.dev/api/v3/runs/${runId}/waitpoints`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIGGER_SECRET_KEY}`,
          },
        });
        const wpData = await wpRes.json();
        if (wpData.data && wpData.data.length > 0) {
          const pendingWp = wpData.data.find((wp: any) => wp.status === "PENDING");
          if (pendingWp) {
            setTokenId(pendingWp.id);
          } else {
            setTokenId(null);
          }
        }

        if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "CANCELLED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">User Onboarding</h1>
        
        {!runId ? (
          <form onSubmit={startOnboarding} className="flex flex-col gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
            >
              {loading ? "Starting..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 max-w-md mx-auto bg-gray-100 p-6 rounded shadow">
            <p><strong>Run ID:</strong> {runId}</p>
            <p><strong>Status:</strong> <span className="font-bold">{status}</span></p>
            
            {status === "Waiting for verification" && tokenId && (
              <div className="mt-4">
                <button
                  onClick={verify}
                  disabled={loading}
                  className="bg-green-500 text-white p-2 rounded w-full disabled:bg-green-300"
                >
                  {loading ? "Verifying..." : "Simulate Email Verification"}
                </button>
                <p className="text-xs mt-2 text-gray-500 text-center">
                  This will complete waitpoint: {tokenId}
                </p>
              </div>
            )}

            {status === "Active" && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center">
                Welcome! Your account is now active.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
