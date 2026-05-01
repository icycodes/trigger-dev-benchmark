"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchStatus = async (currentRunId: string) => {
    const response = await fetch(`/api/status?runId=${currentRunId}`);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch status");
    }
    const data = (await response.json()) as StatusResponse;
    const metadataStatus = data.metadata?.status ?? data.status ?? "Unknown";
    setStatus(metadataStatus);
    setTokenId(data.metadata?.tokenId ?? null);
  };

  useEffect(() => {
    if (!runId) {
      return;
    }

    fetchStatus(runId).catch((err) => setError(err.message));

    const interval = setInterval(() => {
      fetchStatus(runId).catch((err) => setError(err.message));
    }, 5000);

    return () => clearInterval(interval);
  }, [runId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setStatus(null);
    setTokenId(null);

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to start onboarding");
      }

      const data = (await response.json()) as { runId: string };
      setRunId(data.runId);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!tokenId) {
      return;
    }
    setError(null);
    setIsVerifying(true);

    try {
      const response = await fetch(`/api/verify?token=${tokenId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to verify");
      }

      if (runId) {
        await fetchStatus(runId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          <h1>Durable Subscription Onboarding</h1>
          <p className={styles.subtitle}>
            Start onboarding to trigger a waitpoint and simulate email
            verification.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Starting..." : "Start onboarding"}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </section>

        {runId && (
          <section className={styles.statusCard}>
            <h2>Onboarding status</h2>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Run ID</span>
              <span className={styles.statusValue}>{runId}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Status</span>
              <span className={styles.statusValue}>
                {status ?? "Loading..."}
              </span>
            </div>
            {tokenId && (
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Token</span>
                <span className={styles.statusValue}>{tokenId}</span>
              </div>
            )}
            {status === "Waiting for verification" && tokenId && (
              <button
                className={styles.verify}
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                {isVerifying
                  ? "Verifying..."
                  : "Simulate Email Verification"}
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
