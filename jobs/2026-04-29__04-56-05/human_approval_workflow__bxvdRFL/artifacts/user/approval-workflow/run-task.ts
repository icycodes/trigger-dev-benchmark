import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  console.log("Starting task trigger...");
  const handle = await tasks.trigger("deploy-approval-human_approval_workflow__bxvdRFL", {
    version: "v1.0.0",
  });

  console.log(`Run ID: ${handle.id}`);
}

run().catch(console.error);
