import { configure, tasks } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

// Read credentials from Trigger.dev CLI config
const triggerConfig = JSON.parse(
  fs.readFileSync(`${process.env.HOME}/.config/trigger/config.json`, "utf-8")
);
const profile = triggerConfig.profiles[triggerConfig.currentProfile];

configure({
  accessToken: profile.accessToken,
  baseURL: profile.apiUrl,
});

async function main() {
  const handle = await tasks.trigger(
    `resilient-pipeline-${trialId}` as string,
    { input: "initial data" }
  );
  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
