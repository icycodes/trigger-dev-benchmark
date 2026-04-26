import { ffmpegExtractAudioTask } from "./src/trigger/ffmpeg-task.ts";

console.log("Script loaded");

async function run() {
  console.log("Starting task trigger...");
  const videoUrl = "https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4";
  
  try {
    const run = await ffmpegExtractAudioTask.trigger({ videoUrl });
    console.log(`Run ID: ${run.id}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to trigger task:", error);
    process.exit(1);
  }
}

run();
