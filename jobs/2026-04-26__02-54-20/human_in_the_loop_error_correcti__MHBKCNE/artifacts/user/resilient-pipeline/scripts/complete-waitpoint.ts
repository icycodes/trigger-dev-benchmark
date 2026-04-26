import { configure, wait } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

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
  const tokenFilePath = path.join("/home/user/resilient-pipeline", "waitpoint_token.txt");
  const tokenId = fs.readFileSync(tokenFilePath, "utf-8").trim();

  await wait.completeToken<{ correctedInput: string }>(tokenId, {
    correctedInput: "fixed data",
  });

  console.log(`Waitpoint token ${tokenId} completed with correctedInput: "fixed data"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
