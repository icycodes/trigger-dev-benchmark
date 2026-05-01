"use client";

import { useState, useEffect } from "react";
import { startOnboarding, getRunStatus } from "./actions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getRunStatus(runId);
        if (data.metadata) {
          setStatus(data.metadata.status || data.status);
          if (data.metadata.tokenId) {
            setTokenId(data.metadata.tokenId);
          }
        } else {
          setStatus(data.status);
        }

        if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "CANCELED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch run status", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const { runId } = await startOnboarding(email);
      setRunId(runId);
      setStatus("Starting...");
    } catch (err) {
      console.error("Failed to start onboarding", err);
      alert("Failed to start onboarding");
    }
  };

  const handleVerify = async () => {
    if (!tokenId) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/verify?token=${encodeURIComponent(tokenId)}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to verify");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to simulate verification");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-8 text-center">Onboarding Workflow</h1>
        
        {!runId ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded text-black"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg shadow-sm">
            <div>
              <span className="font-semibold">Run ID:</span>{" "}
              <span className="text-gray-600 break-all">{runId}</span>
            </div>
            
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {status || "Loading..."}
              </span>
            </div>

            {status === "Waiting for verification" && tokenId && (
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Simulate Email Verification"}
              </button>
            )}
            
            {status === "Active" && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded border border-green-200">
                Onboarding complete! Your account is now active.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
