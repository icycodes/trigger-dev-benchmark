import { TriggerClient } from "@trigger.dev/sdk";
import { pythonProcessTask } from "../src/trigger/python-task";

const client = new TriggerClient({
  id: "python-task-client",
  apiKey: process.env.TRIGGER_API_KEY!,
});

async function run(): Promise<void> {
  const run = await client.tasks.trigger(pythonProcessTask, [
    10,
    20,
    30,
    40,
    50,
  ]);

  console.log(`Run ID: ${run.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
