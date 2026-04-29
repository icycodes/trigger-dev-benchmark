import { TriggerClient } from "@trigger.dev/sdk";

const client = new TriggerClient({
  id: "ai-approval-task",
  apiKey: process.env.TRIGGER_SECRET_KEY,
});

async function main() {
  const run = await client.tasks.trigger("ai-content-generator-ai_agent_human_in_the_loop_appro__9xYkdNi", {
    title: "The Future of AI",
    summary: "A brief overview of how AI is shaping our world.",
  });

  console.log(`Run ID: ${run.id}`);

  // We need to wait a bit for the task to reach the wait point and generate a token
  // Or we can poll for the token. However, for this task, the requirement is just to trigger and print.
  // Actually, wait.forToken() generates a token that is returned in the run details or via events.
  
  // Let's poll for the token if it's not immediately available.
  let token: string | undefined;
  for (let i = 0; i < 10; i++) {
    const runStatus = await client.runs.retrieve(run.id);
    // In Trigger.dev v3, waitpoints are accessible via the run status or events.
    // However, the most direct way to get the token for wait.forToken is through the run's waitpoints.
    
    // @ts-ignore
    const waitpoint = runStatus.waitpoints?.find(w => w.type === "TOKEN");
    if (waitpoint) {
        token = waitpoint.token;
        break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (token) {
    console.log(`Token: ${token}`);
  } else {
    console.log("Token not found yet. The task might still be initializing.");
  }
}

main().catch(console.error);
