import { TriggerClient } from "@trigger.dev/sdk";
import { aiContentGenerator } from "../src/trigger/ai-generator";

const client = new TriggerClient({
  id: "ai-workflow"
});

const run = async () => {
  const handle = await client.triggerTask(aiContentGenerator.id, {});
  console.log(`Run ID: ${handle.id}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
