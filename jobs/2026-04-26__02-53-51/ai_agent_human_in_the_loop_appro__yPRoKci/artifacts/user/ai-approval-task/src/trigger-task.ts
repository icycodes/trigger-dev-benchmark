import { client } from "@trigger.dev/sdk";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

async function triggerTask() {
  const triggerClient = client({
    id: "ai-approval-task",
  });

  try {
    const result = await triggerClient.sendEvent({
      name: `ai-content-generator-${trialId}`,
      payload: {
        topic: "AI Development",
      },
    });

    console.log(`Run ID: ${result.id}`);
    
    // Wait for the task to start and get the waitpoint token
    // The waitpoint token will be available when the task reaches the wait.forToken() call
    console.log("Task triggered successfully!");
    console.log("To approve this task, run:");
    console.log(`npm run approve-task <token>`);
    
    // Note: In a real implementation, you would need to poll the run status
    // to get the waitpoint token. For this demo, we'll show how to get it.
    
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

triggerTask().catch(console.error);