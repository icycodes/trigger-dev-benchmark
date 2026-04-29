import { tasks, configure } from "@trigger.dev/sdk/v3";
import type { screenshotTask } from "./src/trigger/screenshot";

async function run() {
  const secretKey = process.env.TRIGGER_SECRET_KEY;
  if (!secretKey) {
    console.error("TRIGGER_SECRET_KEY environment variable is required.");
    process.exit(1);
  }

  configure({
    secretKey,
  });

  try {
    const run = await tasks.trigger<typeof screenshotTask>("puppeteer-screenshot-puppeteer_screenshot_task__qTTnTXu", {
      url: "https://example.com",
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
