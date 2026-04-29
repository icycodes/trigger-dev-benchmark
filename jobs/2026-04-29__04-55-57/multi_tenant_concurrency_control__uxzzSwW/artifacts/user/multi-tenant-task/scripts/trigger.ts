import { multiTenantTask } from "../src/trigger/multi_tenant";

async function main() {
  const handles = await Promise.all([
    multiTenantTask.trigger({ userId: "user_A", jobId: "A1" }),
    multiTenantTask.trigger({ userId: "user_A", jobId: "A2" }),
    multiTenantTask.trigger({ userId: "user_B", jobId: "B1" }),
    multiTenantTask.trigger({ userId: "user_B", jobId: "B2" }),
  ]);

  console.log(`Run IDs: ${handles[0].id}, ${handles[1].id}, ${handles[2].id}, ${handles[3].id}`);
}

main().catch(console.error);
