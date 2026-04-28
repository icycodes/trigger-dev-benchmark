import { multiTenantTask } from "../src/trigger/multi_tenant";

async function main() {
  const runs = await Promise.all([
    multiTenantTask.trigger({ userId: "user_A", jobId: "A1" }),
    multiTenantTask.trigger({ userId: "user_A", jobId: "A2" }),
    multiTenantTask.trigger({ userId: "user_B", jobId: "B1" }),
    multiTenantTask.trigger({ userId: "user_B", jobId: "B2" }),
  ]);

  console.log(`Run IDs: ${runs.map(r => r.id).join(", ")}`);
}

main().catch(console.error);
