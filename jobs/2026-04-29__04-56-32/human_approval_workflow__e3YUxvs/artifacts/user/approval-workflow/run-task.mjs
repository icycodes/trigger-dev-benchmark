import { tasks } from "@trigger.dev/sdk";

const handle = await tasks.trigger("deploy-approval-human_approval_workflow__e3YUxvs", {
  version: "v1.0.0",
});

console.log(`Run ID: ${handle.id}`);
