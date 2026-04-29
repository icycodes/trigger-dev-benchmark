import { queue, task } from "@trigger.dev/sdk/v3";

type MultiTenantPayload = {
  userId: string;
  jobId: string;
};

const trialId = "multi_tenant_concurrency_control__Pk2VhBV";

export const multiTenantQueue = queue({
  name: `multi-tenant-queue-${trialId}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trialId}`,
  queue: multiTenantQueue,
  concurrencyKey: (payload: MultiTenantPayload) => payload.userId,
  run: async (payload: MultiTenantPayload, { ctx }) => {
    const startedAt = ctx.run.startedAt;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const finishedAt = ctx.run.finishedAt ?? new Date().toISOString();

    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt,
      finishedAt,
    };
  },
});
