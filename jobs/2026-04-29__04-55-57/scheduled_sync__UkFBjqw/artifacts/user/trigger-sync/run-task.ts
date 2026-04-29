import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  try {
    const handle = await tasks.trigger("scheduled-sync-scheduled_sync__UkFBjqw", {
      timestamp: new Date(),
      lastTimestamp: new Date(),
      externalId: "manual-run",
      timezone: "UTC",
      upcoming: []
    } as any);
    console.log(`Run ID: ${handle.id}`);
  } catch (e) {
    console.error(e);
  }
}

run().catch(console.error);
