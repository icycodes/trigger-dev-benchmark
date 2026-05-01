import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  try {
    const run = await tasks.trigger("puppeteer-screenshot-puppeteer_screenshot_task__EXmJPQP", {
      url: "https://example.com",
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
  }
}

run();
