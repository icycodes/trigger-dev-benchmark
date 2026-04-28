import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const trial_id = "multi_tenant_concurrency_control__PtK9n4V";
  const taskId = `multi-tenant-task-${trial_id}`;

  const payloads = [
    { userId: "user_A", jobId: "A1" },
    { userId: "user_A", jobId: "A2" },
    { userId: "user_B", jobId: "B1" },
    { userId: "user_B", jobId: "B2" },
  ];

  try {
    const results = await Promise.all(
      payloads.map((payload) => tasks.trigger(taskId, payload))
    );

    const runIds = results.map((r: any) => r.id).join(", ");
    console.log(`Run IDs: ${runIds}`);
  } catch (error) {
    console.error("Error triggering tasks:", error);
    process.exit(1);
  }
}

run();
