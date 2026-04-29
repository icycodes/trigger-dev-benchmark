import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const trial_id = "multi_tenant_concurrency_control__a7ZVU4G";
  const taskPayloads = [
    { userId: "user_A", jobId: "A1" },
    { userId: "user_A", jobId: "A2" },
    { userId: "user_B", jobId: "B1" },
    { userId: "user_B", jobId: "B2" },
  ];

  const results = await Promise.all(
    taskPayloads.map((payload) =>
      tasks.trigger(`multi-tenant-task-${trial_id}`, payload, {
        concurrencyKey: payload.userId,
      })
    )
  );

  console.log(`Run IDs: ${results.map((r) => r.id).join(", ")}`);
}

run().catch(console.error);
