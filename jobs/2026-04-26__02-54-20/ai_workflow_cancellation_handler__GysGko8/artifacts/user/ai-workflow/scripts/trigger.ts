import { tasks, configure } from "@trigger.dev/sdk/v3";
import * as fs from "fs";

async function main() {
  const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
  const taskId = `ai-content-generator-${trialId}`;

  // Read API key from environment or Trigger.dev CLI credential config
  let apiKey: string | undefined = process.env.TRIGGER_SECRET_KEY || process.env.TRIGGER_ACCESS_TOKEN;
  if (!apiKey) {
    try {
      const configPath = `${process.env.HOME || "/root"}/.config/trigger/config.json`;
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const profiles = config.profiles || {};
      const defaultProfile = config.default || "default";
      const profile = (profiles[defaultProfile] || Object.values(profiles)[0]) as any;
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

  console.log(`Triggering task: ${taskId}`);

  const handle = await tasks.trigger(taskId, {});
  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error("Failed to trigger task:", err);
  process.exit(1);
});
