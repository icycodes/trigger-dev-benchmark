import { tasks } from "@trigger.dev/sdk/v3";
import { ffmpegExtractAudio } from "./ffmpeg-task";

// Sample video URL (using a short sample video)
const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

async function main() {
  console.log("Triggering FFmpeg audio extraction task...");

  try {
    const run = await tasks.trigger(ffmpegExtractAudio.id, {
      videoUrl: SAMPLE_VIDEO_URL,
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

main();