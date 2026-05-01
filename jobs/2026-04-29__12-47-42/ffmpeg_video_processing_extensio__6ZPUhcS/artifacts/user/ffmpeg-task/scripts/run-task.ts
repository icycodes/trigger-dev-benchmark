import { ffmpegExtractAudio } from "../src/trigger/ffmpeg-task";

const videoUrl =
  process.env.VIDEO_URL ?? "https://www.w3schools.com/html/mov_bbb.mp4";

const runTask = async () => {
  const run = await ffmpegExtractAudio.trigger({ videoUrl });
  console.log(`Run ID: ${run.id}`);
};

runTask().catch((error) => {
  console.error("Failed to trigger task:", error);
  process.exitCode = 1;
});
