import { client } from "@/trigger";
import { Queue } from "@trigger.dev/sdk";

const trialId = "multi_tenant_concurrency_control__QkkBc3M";

// Define the queue with global concurrency limit of 10
const multiTenantQueue = new Queue({
  id: `multi-tenant-queue-${trialId}`,
  name: "Multi-Tenant Queue",
  concurrencyLimit: 10,
});

// Define the payload type
type MultiTenantPayload = {
  userId: string;
  jobId: string;
};

// Define the task with per-user concurrency limit of 1
client.defineJob({
  id: `multi-tenant-task-${trialId}`,
  name: "Multi-Tenant Task",
  queue: multiTenantQueue,
  concurrencyKey: async (payload: MultiTenantPayload) => {
    return payload.userId;
  },
  run: async (payload: MultiTenantPayload, { ctx }) => {
    // Simulate work by sleeping for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    return {
      userId: payload.userId,
      jobId: payload.jobId,
      startedAt: ctx.startedAt,
      finishedAt: ctx.finishedAt,
    };
  },
});