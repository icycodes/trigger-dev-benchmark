import { client } from "@/trigger";

const trialId = "multi_tenant_concurrency_control__QkkBc3M";

async function main() {
  // Trigger 4 task instances in parallel
  const [runA1, runA2, runB1, runB2] = await Promise.all([
    client.sendEvent({
      name: `multi-tenant-task-${trialId}`,
      payload: {
        userId: "user_A",
        jobId: "A1",
      },
    }),
    client.sendEvent({
      name: `multi-tenant-task-${trialId}`,
      payload: {
        userId: "user_A",
        jobId: "A2",
      },
    }),
    client.sendEvent({
      name: `multi-tenant-task-${trialId}`,
      payload: {
        userId: "user_B",
        jobId: "B1",
      },
    }),
    client.sendEvent({
      name: `multi-tenant-task-${trialId}`,
      payload: {
        userId: "user_B",
        jobId: "B2",
      },
    }),
  ]);

  console.log(`Run IDs: ${runA1.id}, ${runA2.id}, ${runB1.id}, ${runB2.id}`);
}

main().catch(console.error);