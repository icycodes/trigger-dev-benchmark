import { envvars, configure } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

async function main() {
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL ?? "https://api.trigger.dev",
  });

  console.log(`Setting TRIAL_ID=${trialId} in Trigger.dev environment...`);

  // Upload env var to the prod environment
  const result = await envvars.upload(
    process.env.TRIGGER_PROJECT_REF!,
    "prod",
    {
      variables: {
        TRIAL_ID: trialId,
      },
      override: true,
    }
  );

  console.log("Environment variable set successfully:", result);
}

main().catch((err) => {
  console.error("Error setting env var:", err);
  process.exit(1);
});
