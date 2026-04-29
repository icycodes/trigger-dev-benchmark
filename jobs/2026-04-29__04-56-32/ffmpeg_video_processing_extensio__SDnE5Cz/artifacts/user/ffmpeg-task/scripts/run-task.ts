import { configure, tasks } from "@trigger.dev/sdk/v3";
import fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ffmpeg-extract-audio-${trialId}`;

async function main() {
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL || "https://api.trigger.dev",
  });

  const handle = await tasks.trigger(taskId, {
    videoUrl:
      "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
