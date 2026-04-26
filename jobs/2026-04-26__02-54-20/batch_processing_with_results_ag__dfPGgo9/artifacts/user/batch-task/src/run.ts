import { configure } from "@trigger.dev/sdk";
import { batchProcessTask } from "./trigger/tasks.js";

configure({
  secretKey: process.env.TRIGGER_SECRET_KEY,
});

const handle = await batchProcessTask.trigger({ numbers: [1, 2, 3, 4, 5] });
console.log(`Run ID: ${handle.id}`);
