import { tasks } from "@trigger.dev/sdk/v3";

const trialId = "puppeteer_screenshot_task__LfTBXBG";
const taskId = `puppeteer-screenshot-${trialId}`;

async function main() {
  const run = await tasks.trigger(taskId, {
    url: "https://example.com",
  });
  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
