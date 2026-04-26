import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  console.log("Starting main...");
  try {
    const run = await tasks.trigger("deploy-approval-human_approval_workflow__BRoa77H", {
      version: "v1.0.0",
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
  }
}

main().catch(console.error);
