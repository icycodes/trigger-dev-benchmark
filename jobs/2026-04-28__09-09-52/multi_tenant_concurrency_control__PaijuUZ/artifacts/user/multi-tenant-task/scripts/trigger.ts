import { tasks } from "@trigger.dev/sdk/v3";

const trialId = "multi_tenant_concurrency_control__PaijuUZ";
const taskId = `multi-tenant-task-${trialId}`;

async function main() {
  try {
    // Trigger 4 task instances in parallel with concurrencyKey for per-user concurrency
    const [runA1, runA2, runB1, runB2] = await Promise.all([
      tasks.trigger(taskId, { userId: "user_A", jobId: "A1" }, {
        concurrencyKey: `user:user_A`,
      }),
      tasks.trigger(taskId, { userId: "user_A", jobId: "A2" }, {
        concurrencyKey: `user:user_A`,
      }),
      tasks.trigger(taskId, { userId: "user_B", jobId: "B1" }, {
        concurrencyKey: `user:user_B`,
      }),
      tasks.trigger(taskId, { userId: "user_B", jobId: "B2" }, {
        concurrencyKey: `user:user_B`,
      }),
    ]);

    // Print the Run IDs in the required format
    console.log(`Run IDs: ${runA1.id}, ${runA2.id}, ${runB1.id}, ${runB2.id}`);
  } catch (error) {
    console.error("Error triggering tasks:", error);
    process.exit(1);
  }
}

main();