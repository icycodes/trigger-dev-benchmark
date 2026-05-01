import { TriggerClient } from "@trigger.dev/sdk";

async function main() {
  const client = new TriggerClient({
    id: "python-task",
    apiKey: process.env.TRIGGER_API_KEY,
    apiUrl: process.env.TRIGGER_API_URL,
  });

  const run = await client.sendEvent({
    name: "python-process-python_extension_data_processing__HG5pfuo",
    payload: [10, 20, 30, 40, 50],
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
