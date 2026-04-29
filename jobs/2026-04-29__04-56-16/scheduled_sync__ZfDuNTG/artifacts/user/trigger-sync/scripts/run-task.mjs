import { tasks } from "@trigger.dev/sdk/v3";
import { readFile } from "node:fs/promises";

const trialId = (await readFile("/logs/trial_id", "utf8")).trim();
const taskId = `scheduled-sync-${trialId}`;

const handle = await tasks.trigger(taskId, undefined);

console.log(`Run ID: ${handle.id}`);
