"use client";

import { useEffect, useState } from "react";

type RunMetadata = {
  status?: string;
  tokenId?: string;
};

type StatusResponse = {
  status?: string;
  metadata?: RunMetadata;
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const startOnboarding = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to start onboarding");
      }

      setRunId(data.runId);
      setStatus("Waiting for verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateVerification = async () => {
    if (!tokenId) {
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error ?? "Failed to verify");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!runId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?runId=${runId}`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as StatusResponse;
        const metadataStatus = data.metadata?.status;
        const nextStatus = metadataStatus ?? data.status ?? null;
        setStatus(nextStatus);
        setTokenId(data.metadata?.tokenId ?? null);
      } catch {
        // Ignore polling errors and try again on the next interval.
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Trigger.dev onboarding demo
          </p>
          <h1 className="text-3xl font-semibold">Durable subscription onboarding</h1>
          <p className="text-slate-300">
            Start a trial onboarding workflow, then wait for the verification step
            to be completed.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
          <form className="flex flex-col gap-4" onSubmit={startOnboarding}>
            <label className="text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
              placeholder="you@company.com"
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
            >
              {isSubmitting ? "Starting..." : "Start onboarding"}
            </button>
          </form>
        </section>

        {runId ? (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <p className="text-sm text-slate-400">Run ID</p>
              <p className="font-mono text-sm text-slate-100 break-all">{runId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-lg font-semibold text-slate-100">
                {status ?? "Pending"}
              </p>
            </div>
            {tokenId && status === "Waiting for verification" ? (
              <button
                type="button"
                onClick={simulateVerification}
                disabled={isVerifying}
                className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-400"
              >
                {isVerifying ? "Verifying..." : "Simulate Email Verification"}
              </button>
            ) : null}
          </section>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}
      </main>
    </div>
  );
}
