import { extractAudioTask } from "../src/trigger/ffmpeg-task";

async function main() {
  const result = await extractAudioTask.trigger({
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  });
  console.log(`Run ID: ${result.id}`);
}

main().catch(console.error);
