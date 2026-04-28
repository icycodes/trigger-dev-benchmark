import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const handle = await tasks.trigger("scheduled-sync-scheduled_sync__n66mBp7", {});
  console.log(`Run ID: ${handle.id}`);
}

run().catch(console.error);
