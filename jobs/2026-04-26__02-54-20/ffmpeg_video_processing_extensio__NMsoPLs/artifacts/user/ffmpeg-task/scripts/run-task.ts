import { configure, auth, tasks } from "@trigger.dev/sdk";
import fs from "fs";

const TRIAL_ID = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const TASK_ID = `ffmpeg-extract-audio-${TRIAL_ID}`;
const SAMPLE_VIDEO_URL =
  "https://www.w3schools.com/html/mov_bbb.mp4";

async function main() {
  // Configure the SDK with credentials from environment
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL ?? "https://api.trigger.dev",
  });

  console.log(`Triggering task: ${TASK_ID}`);

  const handle = await tasks.trigger(TASK_ID, {
    videoUrl: SAMPLE_VIDEO_URL,
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
