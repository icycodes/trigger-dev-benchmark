import { batchProcessTask } from "./trigger/tasks";
import { configure } from "@trigger.dev/sdk";

configure({
  secretKey: process.env.TRIGGER_SECRET_KEY,
});

async function main() {
  try {
    const handle = await batchProcessTask.trigger([1, 2, 3, 4, 5]);
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main();
