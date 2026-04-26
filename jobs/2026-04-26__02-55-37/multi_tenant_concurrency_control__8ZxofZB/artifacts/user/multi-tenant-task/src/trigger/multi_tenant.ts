import { task, queue } from "@trigger.dev/sdk/v3";

const trialId = "multi_tenant_concurrency_control__8ZxofZB";

const multiTenantQueue = queue({
  name: `multi-tenant-queue-${trialId}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trialId}`,
  queue: {
    name: `multi-tenant-queue-${trialId}`,
    concurrencyLimit: 10,
  },
  concurrencyKey: (payload: { userId: string; jobId: string }) => payload.userId,
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
