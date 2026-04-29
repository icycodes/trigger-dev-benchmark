"use client";

import { useState, useEffect } from "react";
import { triggerOnboarding, getRunStatus } from "./actions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await triggerOnboarding(email);
    setRunId(id);
    setStatus("Triggered");
  };

  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(async () => {
      try {
        const run = await getRunStatus(runId);
        
        const metadata = run.metadata as any;
        const currentStatus = metadata?.status || run.status;
        setStatus(currentStatus);
        
        if (metadata?.tokenId) {
          setTokenId(metadata.tokenId);
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  const simulateVerification = async () => {
    if (!tokenId) return;
    setVerifying(true);
    try {
      await fetch(`/api/verify?token=${tokenId}`, { method: "POST" });
    } catch (err) {
      console.error("Error verifying:", err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Onboarding Flow</h1>
      
      {!runId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full text-black"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded self-start">
            Sign Up
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4 border p-4 rounded">
          <h2 className="text-xl font-semibold">Onboarding Progress</h2>
          <p><strong>Run ID:</strong> {runId}</p>
          <p><strong>Status:</strong> {status}</p>
          
          {tokenId && status === "Waiting for verification" && (
            <button 
              onClick={simulateVerification}
              disabled={verifying}
              className="bg-green-500 text-white px-4 py-2 rounded self-start disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Simulate Email Verification"}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
