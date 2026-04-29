import { extractAudio } from "./trigger/ffmpeg-task";

async function main() {
  const run = await extractAudio.trigger({
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  });
  console.log(`Run ID: ${run.id}`);
}

main().catch(console.error);
