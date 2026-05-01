import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  console.log("Triggering task...");
  const result = await tasks.trigger("python-process-python_extension_data_processing__2jC4PM2", [10, 20, 30, 40, 50]);
  console.log(`Run ID: ${result.id}`);
}

run().catch(console.error);
