import { configure, runs } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `research-pipeline-${trialId}`;

const accessToken = JSON.parse(
  fs.readFileSync(`${process.env.HOME}/.config/trigger/config.json`, "utf-8")
).profiles.default.accessToken;

configure({
  accessToken,
  baseURL: "https://api.trigger.dev",
});

async function main() {
  const handle = await runs.trigger(taskId, {
    topic: "Artificial Intelligence",
    languages: ["Spanish", "French", "German"],
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
