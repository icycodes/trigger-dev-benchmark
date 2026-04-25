import { tasks } from "@trigger.dev/sdk";

async function main() {
  const run = await tasks.trigger("deploy-approval-human_approval_workflow__FgcvnPu", { version: "v1.0.0" });
  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
