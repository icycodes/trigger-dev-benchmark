import { tasks } from "@trigger.dev/sdk";
import fs from "node:fs/promises";

const run = async () => {
  const trialId = (await fs.readFile("/logs/trial_id", "utf8")).trim();
  const taskId = `puppeteer-screenshot-${trialId}`;

  const runResult = await tasks.trigger(taskId, {
    url: "https://example.com",
  });

  console.log(`Run ID: ${runResult.id}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
