import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const run = await tasks.trigger("ai-content-generator-ai_workflow_cancellation_handler__nnBXTy4", {});
  console.log(`Run ID: ${run.id}`);
}

main().catch(e => {
  console.error("Error triggering:", e);
});
