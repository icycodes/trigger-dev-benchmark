import { tasks } from "@trigger.dev/sdk/v3";
import type { screenshotTask } from "./src/trigger/screenshot";

async function main() {
  const run = await tasks.trigger<typeof screenshotTask>("puppeteer-screenshot-puppeteer_screenshot_task__MSZro9z", {
    url: "https://example.com"
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
