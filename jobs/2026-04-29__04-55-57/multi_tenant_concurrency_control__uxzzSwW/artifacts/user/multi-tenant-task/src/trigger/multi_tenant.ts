import { queue, task } from "@trigger.dev/sdk/v3";

export const multiTenantQueue = queue({
  name: "multi-tenant-queue-multi_tenant_concurrency_control__uxzzSwW",
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: "multi-tenant-task-multi_tenant_concurrency_control__uxzzSwW",
  queue: multiTenantQueue,
  // @ts-ignore
  concurrencyKey: (payload: { userId: string; jobId: string }) => payload.userId,
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
