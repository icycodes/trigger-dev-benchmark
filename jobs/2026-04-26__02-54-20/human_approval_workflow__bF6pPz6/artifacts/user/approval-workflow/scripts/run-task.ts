import { tasks } from "@trigger.dev/sdk";
import { deployApprovalTask } from "../src/trigger/approval";

async function main() {
  const run = await tasks.trigger(deployApprovalTask, { version: "v1.0.0" });
  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
