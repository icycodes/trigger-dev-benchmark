import { tasks } from "@trigger.dev/sdk/v3";
import { resilientPipeline } from "./src/trigger/tasks";

async function run() {
  const run = await resilientPipeline.trigger({ input: "initial data" });
  console.log(`Run ID: ${run.id}`);
}

run().catch(console.error);
