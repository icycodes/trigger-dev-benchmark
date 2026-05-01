import { syncTask } from "./src/trigger/sync";

async function main() {
  const handle = await syncTask.trigger({
    timestamp: new Date(),
    lastTimestamp: new Date(),
    externalId: "manual-run"
  });
  console.log(`Run ID: ${handle.id}`);
}

main().catch(console.error);
