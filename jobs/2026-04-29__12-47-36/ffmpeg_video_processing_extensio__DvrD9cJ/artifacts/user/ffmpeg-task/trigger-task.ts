import { ffmpegExtractAudio } from "./src/trigger/ffmpeg-task.js";

async function main() {
  try {
    const handle = await ffmpegExtractAudio.trigger({
      videoUrl: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4"
    });

    console.log(`Run ID: ${handle.id}`);
  } catch (error: any) {
    console.error("Error triggering task:", error.message || error);
    process.exit(1);
  }
}

main();
