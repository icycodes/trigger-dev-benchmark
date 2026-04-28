import { tasks } from "@trigger.dev/sdk";

async function main() {
  const run = await tasks.trigger("scheduled-sync-scheduled_sync__AhEGSL8", {});
  console.log(`Run ID: ${run.id}`);
}
main().catch(console.error);
