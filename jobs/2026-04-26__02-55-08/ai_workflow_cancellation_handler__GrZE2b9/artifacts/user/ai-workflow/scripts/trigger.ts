import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  try {
    const handle = await tasks.trigger("ai-content-generator-ai_workflow_cancellation_handler__GrZE2b9", {
      prompt: "Generate some content",
    });
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

run();
