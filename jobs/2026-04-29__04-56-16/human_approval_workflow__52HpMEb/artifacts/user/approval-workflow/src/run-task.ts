import { deployApprovalTask } from "./trigger/approval";

async function runTask() {
  const run = await deployApprovalTask.trigger({
    version: "v1.0.0",
  });

  console.log(`Run ID: ${run.id}`);
}

runTask().catch((error) => {
  console.error(error);
  process.exit(1);
});
