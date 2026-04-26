console.log("Starting trigger script...");
const { tasks } = require("@trigger.dev/sdk/v3");

async function run() {
  try {
    const run = await tasks.trigger("puppeteer-screenshot-puppeteer_screenshot_task__ByCn3JK", {
      url: "https://example.com",
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error.message || error);
  }
}

run().catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
});
