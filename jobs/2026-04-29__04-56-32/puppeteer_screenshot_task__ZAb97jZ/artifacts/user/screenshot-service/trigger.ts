import { tasks } from "@trigger.dev/sdk/v3";

const trialId = "puppeteer_screenshot_task__ZAb97jZ";
const taskId = `puppeteer-screenshot-${trialId}`;
const sampleUrl = "https://example.com";

async function main() {
  const run = await tasks.trigger(taskId, { url: sampleUrl });
  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
