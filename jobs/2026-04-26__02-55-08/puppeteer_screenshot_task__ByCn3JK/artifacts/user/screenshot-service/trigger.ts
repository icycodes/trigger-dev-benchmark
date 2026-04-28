import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  console.log("Starting trigger script...");
  try {
    const run = await tasks.trigger("puppeteer-screenshot-puppeteer_screenshot_task__ByCn3JK", {
      url: "https://example.com",
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error: any) {
    console.error("Failed to trigger task:", error.message);
  }
}

run().catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
});
