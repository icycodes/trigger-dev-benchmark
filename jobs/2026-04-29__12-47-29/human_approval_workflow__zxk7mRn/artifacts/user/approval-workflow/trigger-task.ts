import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const handle = await tasks.trigger("deploy-approval-human_approval_workflow__zxk7mRn", { version: "v1.0.0" });
  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);