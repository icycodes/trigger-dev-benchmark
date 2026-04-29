import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  console.log("Triggering task...");
  const run = await tasks.trigger<any>(
    "puppeteer-screenshot-puppeteer_screenshot_task__9BLXpnW",
    {
      url: "https://example.com",
      url_slug: "example-com",
    }
  );

  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error("Error:", err);
});
