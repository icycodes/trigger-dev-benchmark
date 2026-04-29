import { tasks } from "@trigger.dev/sdk/v3";
import { readFileSync } from "fs";

const trial_id = readFileSync("/logs/trial_id", "utf-8").trim();

async function main() {
  try {
    const handle = await tasks.trigger(`scheduled-sync-${trial_id}`, {});
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main();
