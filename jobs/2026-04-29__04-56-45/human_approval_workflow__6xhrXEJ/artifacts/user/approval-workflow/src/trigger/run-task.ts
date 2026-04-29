import { client } from "@trigger.dev/sdk";
import { deployApprovalTask } from "./approval";

async function main() {
  // Initialize the Trigger.dev client
  const triggerClient = client({
    id: "approval-workflow",
    apiKey: process.env.TRIGGER_API_KEY || "",
  });

  try {
    // Trigger the task with a version payload
    const run = await triggerClient.sendEvent({
      name: `deploy-approval-human_approval_workflow__6xhrXEJ`,
      payload: {
        version: "v1.0.0",
      },
    });

    // Print the Run ID
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});