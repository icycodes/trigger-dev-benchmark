const fs = require("node:fs");
const { tasks } = require("@trigger.dev/sdk/v3");

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ffmpeg-extract-audio-${trialId}`;
const videoUrl = "https://filesamples.com/samples/video/mp4/sample_640x360.mp4";

async function run() {
  const handle = await tasks.trigger(taskId, { videoUrl });
  console.log(`Run ID: ${handle.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
