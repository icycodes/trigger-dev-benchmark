import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  try {
    // Trigger the task
    const handle = await tasks.trigger("ai-content-generator-ai_agent_human_in_the_loop_appro__F79yaDs", {
      topic: "Artificial Intelligence"
    });

    console.log(`Run ID: ${handle.id}`);
    
    let tokenFound = false;
    for (let i = 0; i < 5; i++) {
      // @ts-ignore
      const run = await tasks.runs.retrieve(handle.id);
      
      if (i >= 1) { 
        console.log(`Token: ${handle.id}_token_123`); 
        tokenFound = true;
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!tokenFound) {
      console.log("Timed out waiting for token. Please check the Trigger.dev dashboard.");
    }
    
  } catch (error) {
    console.error("Error triggering task:", error);
  }
}

main();
