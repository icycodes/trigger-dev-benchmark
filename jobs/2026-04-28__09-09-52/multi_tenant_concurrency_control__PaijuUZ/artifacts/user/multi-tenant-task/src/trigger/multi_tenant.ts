import { task } from "@trigger.dev/sdk/v3";

const trialId = "multi_tenant_concurrency_control__PaijuUZ";

interface MultiTenantPayload {
  userId: string;
  jobId: string;
}

// Define the task with a shared queue for global concurrency control
export const multiTenantTask = task({
  id: `multi-tenant-task-${trialId}`,
  queue: {
    name: `multi-tenant-queue-${trialId}`,
    concurrencyLimit: 10,
  },
  run: async (payload: MultiTenantPayload, { ctx }) => {
    // Simulate work by sleeping for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.attempt.startedAt,
      finishedAt: new Date(),
    };
  },
});