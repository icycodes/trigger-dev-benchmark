import { tasks } from "@trigger.dev/sdk";
import { screenshotTask } from "./src/trigger/screenshot";

const url = process.argv[2] ?? "https://example.com";

const runTask = async () => {
  const run = await tasks.trigger(screenshotTask, { url });
  console.log(`Run ID: ${run.id}`);
};

runTask().catch((error) => {
  console.error(error);
  process.exit(1);
});
