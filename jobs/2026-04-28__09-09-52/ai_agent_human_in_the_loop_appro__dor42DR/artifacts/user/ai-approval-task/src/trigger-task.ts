import { TriggerClient } from "@trigger.dev/sdk";

const TRIAL_ID = "ai_agent_human_in_the_loop_appro__dor42DR";

async function triggerTask() {
  if (!process.env.TRIGGER_PROJECT_REF) {
    throw new Error("TRIGGER_PROJECT_REF environment variable is not set");
  }

  if (!process.env.TRIGGER_SECRET_KEY) {
    throw new Error("TRIGGER_SECRET_KEY environment variable is not set");
  }

  const client = new TriggerClient({
    id: process.env.TRIGGER_PROJECT_REF,
    apiKey: process.env.TRIGGER_SECRET_KEY,
  });

  try {
    // Trigger the task with a sample payload
    const result = await client.sendEvent({
      name: `ai-content-generator-${TRIAL_ID}`,
      payload: {
        message: "Generate AI content for approval",
      },
    });

    if (result) {
      // The result should contain the run ID
      const runId = "runId" in result ? result.runId : result.event?.id;
      console.log(`Run ID: ${runId}`);
      
      // For wait.forToken(), the token is generated internally
      // We'll use the runId to identify the task
      console.log(`Token: ${runId}`);
    } else {
      console.error("Failed to trigger task: Invalid response");
      process.exit(1);
    }
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

triggerTask().catch(console.error);