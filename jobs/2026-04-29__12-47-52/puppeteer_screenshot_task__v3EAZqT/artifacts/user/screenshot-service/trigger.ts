import { puppeteerScreenshotTask } from "./src/trigger/screenshot";

async function main() {
  try {
    console.log("Triggering screenshot task...");
    
    // Trigger the task with a sample URL using the task's trigger method
    const handle = await puppeteerScreenshotTask.trigger({
      payload: {
        url: "https://example.com",
      },
    });
    
    // Print the run ID
    console.log(`Run ID: ${handle.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error triggering task:", error);
  process.exit(1);
});