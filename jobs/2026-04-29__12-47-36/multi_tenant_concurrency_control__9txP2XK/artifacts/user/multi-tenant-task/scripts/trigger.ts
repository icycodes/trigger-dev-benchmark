import { tasks } from "@trigger.dev/sdk";

const trial_id = "multi_tenant_concurrency_control__9txP2XK";

async function run() {
  const task_id = `multi-tenant-task-${trial_id}`;
  
  const payloads = [
    { userId: "user_A", jobId: "A1" },
    { userId: "user_A", jobId: "A2" },
    { userId: "user_B", jobId: "B1" },
    { userId: "user_B", jobId: "B2" },
  ];

  const results = await Promise.all(
    payloads.map((payload) => tasks.trigger(task_id, payload))
  );

  const runIds = results.map((r: any) => r.id);
  console.log(`Run IDs: ${runIds.join(", ")}`);
}

run().catch(console.error);
