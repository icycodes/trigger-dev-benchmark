import { runs, configure } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

async function main() {
  const runId = process.argv[2];
  if (!runId) {
    console.error("Usage: npm run cancel-task -- <runId>");
    process.exit(1);
  }

  // Read API key from environment or Trigger.dev CLI credential config
  let apiKey: string | undefined = process.env.TRIGGER_SECRET_KEY || process.env.TRIGGER_ACCESS_TOKEN;
  if (!apiKey) {
    try {
      const configPath = `${process.env.HOME || "/root"}/.config/trigger/config.json`;
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const profiles = config.profiles || {};
      const defaultProfile = config.default || "default";
      const profile = profiles[defaultProfile] || Object.values(profiles)[0] as any;
      apiKey = profile?.accessToken || profile?.token;
    } catch {
      // ignore
    }
  }

  if (!apiKey) {
    console.error("Error: No Trigger.dev API key found. Set TRIGGER_SECRET_KEY environment variable.");
    process.exit(1);
  }

  configure({ secretKey: apiKey });

  console.log(`Cancelling run: ${runId}`);
  await runs.cancel(runId);
  console.log(`Run ${runId} has been cancelled.`);
}

main().catch((err) => {
  console.error("Failed to cancel run:", err);
  process.exit(1);
});
