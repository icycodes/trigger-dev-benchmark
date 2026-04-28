import { ffmpegExtractAudio } from "./trigger/ffmpeg-task";

const sampleVideoUrl =
  "https://filesamples.com/samples/video/mp4/sample_640x360.mp4";

async function main() {
  const run = await ffmpegExtractAudio.trigger({
    videoUrl: sampleVideoUrl,
  });

  console.log(`Run ID: ${run.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
