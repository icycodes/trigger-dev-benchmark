"use client";

import { type FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";

type RunMetadata = {
  status?: string;
  tokenId?: string;
  email?: string;
};

type RunResponse = {
  id: string;
  status: string;
  metadata: RunMetadata;
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RunMetadata>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!runId) {
      return;
    }

    let isMounted = true;

    const pollRun = async () => {
      try {
        const response = await fetch(`/api/run?runId=${encodeURIComponent(runId)}`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as RunResponse;
        if (!isMounted) {
          return;
        }

        setRunStatus(data.status);
        setMetadata(data.metadata ?? {});
      } catch {
        // Ignore polling errors.
      }
    };

    pollRun();
    const intervalId = window.setInterval(pollRun, 2000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [runId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to start onboarding.");
      }

      const data = (await response.json()) as { runId: string };
      setRunId(data.runId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!metadata.tokenId) {
      return;
    }

    await fetch(`/api/verify?token=${encodeURIComponent(metadata.tokenId)}`, {
      method: "POST",
    });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Durable Subscription Onboarding</h1>
          <p>Trigger a waitpoint-backed onboarding flow and simulate verification.</p>
        </header>

        <section className={styles.card}>
          <h2>Sign up</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Email address
              <input
                className={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Starting..." : "Start onboarding"}
            </button>
          </form>
          {error ? <p className={styles.error}>{error}</p> : null}
        </section>

        <section className={styles.card}>
          <h2>Onboarding status</h2>
          {runId ? (
            <div className={styles.statusBlock}>
              <p>
                <strong>Run ID:</strong> {runId}
              </p>
              <p>
                <strong>Run status:</strong> {runStatus ?? "Fetching..."}
              </p>
              <p>
                <strong>Onboarding:</strong> {metadata.status ?? "Pending"}
              </p>
              {metadata.tokenId && metadata.status === "Waiting for verification" ? (
                <button className={styles.secondaryButton} type="button" onClick={handleVerify}>
                  Simulate Email Verification
                </button>
              ) : null}
            </div>
          ) : (
            <p>Start the onboarding flow to see run details.</p>
          )}
        </section>
      </main>
    </div>
  );
}
