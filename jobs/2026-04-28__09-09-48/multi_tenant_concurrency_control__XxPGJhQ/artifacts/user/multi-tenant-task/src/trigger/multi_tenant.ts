import { queue, task } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const multiTenantQueue = queue({
  name: `multi-tenant-queue-${trialId}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trialId}`,
  queue: multiTenantQueue,
  maxDuration: 3600,
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    const startedAt = ctx.run.startedAt;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const finishedAt = new Date();

    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt,
      finishedAt,
    };
  },
});
