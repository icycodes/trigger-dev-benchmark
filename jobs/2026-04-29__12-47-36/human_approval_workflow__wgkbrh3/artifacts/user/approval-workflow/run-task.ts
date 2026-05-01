import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  try {
    const handle = await tasks.trigger("deploy-approval-human_approval_workflow__wgkbrh3", {
      version: "v1.0.0",
    });
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

run();
