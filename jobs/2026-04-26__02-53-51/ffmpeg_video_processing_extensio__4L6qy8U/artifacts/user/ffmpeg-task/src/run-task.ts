import { tasks } from "@trigger.dev/sdk/v3";
import { ffmpegExtractAudio } from "./trigger/ffmpeg-task";

async function runTask() {
  try {
    // Sample video URL (using a public domain video for testing)
    const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

    console.log("Triggering ffmpeg extract audio task...");
    console.log(`Video URL: ${videoUrl}`);

    // Trigger the task
    const run = await tasks.trigger("ffmpeg-extract-audio-ffmpeg_video_processing_extensio__4L6qy8U", {
      videoUrl,
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

runTask();