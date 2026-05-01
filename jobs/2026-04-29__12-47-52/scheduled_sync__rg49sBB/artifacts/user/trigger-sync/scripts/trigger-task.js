const { TriggerClient } = require("@trigger.dev/sdk");

async function triggerTask() {
  const client = new TriggerClient({
    id: "trigger-sync",
    apiKey: process.env.TRIGGER_API_KEY,
  });

  try {
    const run = await client.trigger("scheduled-sync-scheduled_sync__rg49sBB", {});
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

triggerTask();