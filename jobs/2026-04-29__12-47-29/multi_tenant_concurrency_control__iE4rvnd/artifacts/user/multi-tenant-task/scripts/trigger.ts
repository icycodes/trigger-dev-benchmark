import { tasks } from "@trigger.dev/sdk/v3";
import { multiTenantTask } from "../src/trigger/multi_tenant";

async function main() {
  const trial_id = "multi_tenant_concurrency_control__iE4rvnd";
  const taskId = `multi-tenant-task-${trial_id}`;

  const runs = await Promise.all([
    tasks.trigger(taskId, { userId: "user_A", jobId: "A1" }),
    tasks.trigger(taskId, { userId: "user_A", jobId: "A2" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B1" }),
    tasks.trigger(taskId, { userId: "user_B", jobId: "B2" }),
  ]);

  const runIds = runs.map((run) => run.id);
  console.log(`Run IDs: ${runIds.join(", ")}`);
}

main().catch(console.error);
