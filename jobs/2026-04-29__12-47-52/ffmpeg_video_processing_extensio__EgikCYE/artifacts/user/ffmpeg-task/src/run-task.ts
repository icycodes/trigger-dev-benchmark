import { tasks } from "@trigger.dev/sdk";

const trialId = "ffmpeg_video_processing_extensio__EgikCYE";
const taskId = `ffmpeg-extract-audio-${trialId}`;

// Sample video URL for testing
const sampleVideoUrl =
  "https://www.w3schools.com/html/mov_bbb.mp4";

async function runTask() {
  try {
    console.log("Triggering FFmpeg audio extraction task...");

    // Trigger the task with the sample video URL
    const run = await tasks.trigger(taskId, {
      videoUrl: sampleVideoUrl,
    });

    console.log(`Run ID: ${run.id}`);
  } catch (error) {
    console.error("Error triggering task:", error);
    process.exit(1);
  }
}

runTask();