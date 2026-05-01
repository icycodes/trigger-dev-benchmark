import { tasks } from "@trigger.dev/sdk";
import fs from "node:fs";

import "./src/trigger/screenshot";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `puppeteer-screenshot-${trialId}`;

const main = async () => {
  const run = await tasks.trigger(taskId, {
    url: "https://example.com",
  });

  console.log(`Run ID: ${run.id}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
