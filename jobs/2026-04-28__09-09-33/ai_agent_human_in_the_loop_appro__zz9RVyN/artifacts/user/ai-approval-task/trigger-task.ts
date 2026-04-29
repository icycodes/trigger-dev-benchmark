import { tasks, wait } from "@trigger.dev/sdk";
import { aiContentGenerator } from "./src/trigger/ai-generator";

async function main() {
  const token = await wait.createToken();
  const handle = await tasks.trigger(aiContentGenerator.id, { 
    topic: "Trigger.dev", 
    waitpointToken: token.id 
  });
  
  console.log(`Run ID: ${handle.id}`);
  console.log(`Token: ${token.id}`);
}

main().catch(console.error);
