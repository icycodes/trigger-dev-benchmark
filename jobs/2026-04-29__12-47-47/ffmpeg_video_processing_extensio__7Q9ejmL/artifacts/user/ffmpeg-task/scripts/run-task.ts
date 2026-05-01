import { configure, tasks } from "@trigger.dev/sdk";
import * as fs from "fs";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const taskId = `ffmpeg-extract-audio-${trialId}`;

async function main() {
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY!,
    baseURL: process.env.TRIGGER_API_URL || "https://api.trigger.dev",
  });

  const handle = await tasks.trigger(taskId, {
    videoUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
