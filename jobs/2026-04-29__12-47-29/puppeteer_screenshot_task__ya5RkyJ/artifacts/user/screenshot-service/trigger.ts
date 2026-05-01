import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const url = process.argv[2] || "https://example.com";
  try {
    const run = await tasks.trigger("puppeteer-screenshot-puppeteer_screenshot_task__ya5RkyJ", { url });
    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Failed to trigger task:", error);
  }
}

main();
