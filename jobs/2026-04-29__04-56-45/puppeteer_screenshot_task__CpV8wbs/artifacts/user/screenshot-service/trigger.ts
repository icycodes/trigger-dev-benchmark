import { tasks } from "@trigger.dev/sdk";
import { screenshotTask } from "./src/trigger/screenshot";

async function main() {
  const run = await tasks.trigger(screenshotTask, {
    url: "https://example.com",
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);