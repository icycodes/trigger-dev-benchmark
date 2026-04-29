import { ffmpegExtractAudio } from "./trigger/ffmpeg-task.ts";

async function run() {
  const res = await ffmpegExtractAudio.trigger({
    videoUrl: "https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4"
  });
  console.log(`Run ID: ${res.id}`);
}

run().catch(console.error);
