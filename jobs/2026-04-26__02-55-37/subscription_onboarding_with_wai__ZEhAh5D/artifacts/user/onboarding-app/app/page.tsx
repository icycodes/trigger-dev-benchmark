"use client";

import { useState, useEffect } from "react";
import { startOnboarding } from "./actions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      const res = await startOnboarding(formData);
      setRunId(res.runId);
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
        const res = await fetch(`/api/run?runId=${runId}`);
        const data = await res.json();
        
        if (data.metadata?.status) {
          setStatus(data.metadata.status);
        }
        
        if (data.metadata?.tokenId) {
          setTokenId(data.metadata.tokenId);
        }

        if (data.status === "COMPLETED" || data.status === "FAILED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  const simulateVerification = async () => {
    if (!tokenId) return;
    setLoading(true);
    try {
      await fetch(`/api/verify?token=${tokenId}`, { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      
      {!runId ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Starting..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <div className="space-y-4 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold">Onboarding Status</h2>
          <p><strong>Run ID:</strong> {runId}</p>
          <p><strong>Status:</strong> {status || "Starting..."}</p>
          
          {status === "Waiting for verification" && tokenId && (
            <button
              onClick={simulateVerification}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Simulate Email Verification"}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
