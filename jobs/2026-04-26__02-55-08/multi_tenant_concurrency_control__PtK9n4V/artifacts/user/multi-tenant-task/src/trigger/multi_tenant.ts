import { task, queue } from "@trigger.dev/sdk/v3";

const trial_id = "multi_tenant_concurrency_control__PtK9n4V";

const multiTenantQueue = queue({
  id: `multi-tenant-queue-${trial_id}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trial_id}`,
  queue: multiTenantQueue,
  concurrencyKey: (payload: { userId: string; jobId: string }) => payload.userId,
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    console.log(`Starting job ${payload.jobId} for user ${payload.userId}`);
    
    const startedAt = new Date();
    
    // Simulate work by sleeping for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const finishedAt = new Date();
    
    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.run.startedAt,
      finishedAt: finishedAt,
    };
  },
});
