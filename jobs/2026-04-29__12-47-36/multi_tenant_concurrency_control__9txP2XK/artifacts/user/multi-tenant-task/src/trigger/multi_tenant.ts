import { task, queue } from "@trigger.dev/sdk";

const trial_id = "multi_tenant_concurrency_control__9txP2XK";

export const multiTenantQueue = queue({
  id: `multi-tenant-queue-${trial_id}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trial_id}`,
  queue: multiTenantQueue,
  concurrencyKey: (payload: { userId: string; jobId: string }) => payload.userId,
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    const startedAt = new Date();
    
    // Simulate work by sleeping for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const finishedAt = new Date();
    
    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.run.startedAt || startedAt,
      finishedAt: finishedAt,
    };
  },
});
