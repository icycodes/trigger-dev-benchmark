import { task, queue } from "@trigger.dev/sdk/v3";

const trial_id = "multi_tenant_concurrency_control__a7ZVU4G";

export const multiTenantQueue = queue({
  name: `multi-tenant-queue-${trial_id}`,
  concurrencyLimit: 10,
});

export const multiTenantTask = task({
  id: `multi-tenant-task-${trial_id}`,
  queue: {
    name: `multi-tenant-queue-${trial_id}`,
    concurrencyLimit: 1,
  },
  run: async (payload: { userId: string; jobId: string }, { ctx }) => {
    console.log(`Starting task for user ${payload.userId}, job ${payload.jobId}`);
    
    // Simulate work by sleeping for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.run.startedAt,
      finishedAt: new Date(),
    };
  },
});
