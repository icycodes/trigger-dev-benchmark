import { configure, tasks } from "@trigger.dev/sdk/v3";

const trialId = "multi_tenant_concurrency_control__Pk2VhBV";
const taskId = `multi-tenant-task-${trialId}`;

if (process.env.TRIGGER_SECRET_KEY) {
  configure({
    accessToken: process.env.TRIGGER_SECRET_KEY,
    ...(process.env.TRIGGER_API_URL
      ? { baseURL: process.env.TRIGGER_API_URL }
      : {}),
  });
}

const runHandles = await Promise.all([
  tasks.trigger(
    taskId,
    { userId: "user_A", jobId: "A1" },
    { concurrencyKey: "user_A" }
  ),
  tasks.trigger(
    taskId,
    { userId: "user_A", jobId: "A2" },
    { concurrencyKey: "user_A" }
  ),
  tasks.trigger(
    taskId,
    { userId: "user_B", jobId: "B1" },
    { concurrencyKey: "user_B" }
  ),
  tasks.trigger(
    taskId,
    { userId: "user_B", jobId: "B2" },
    { concurrencyKey: "user_B" }
  ),
]);

const runIds = runHandles.map((handle) => handle.id).join(", ");
console.log(`Run IDs: ${runIds}`);
