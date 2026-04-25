import { scheduledSync } from "../src/trigger/sync";
async function main() {
  try {
    const handle = await scheduledSync.trigger({
      type: "DECLARATIVE",
      timestamp: new Date(),
      timezone: "UTC",
      scheduleId: "manual-run",
      upcoming: []
    });
    console.log("Run ID:", handle.id);
  } catch (e) {
    console.error(e);
  }
}
main();
