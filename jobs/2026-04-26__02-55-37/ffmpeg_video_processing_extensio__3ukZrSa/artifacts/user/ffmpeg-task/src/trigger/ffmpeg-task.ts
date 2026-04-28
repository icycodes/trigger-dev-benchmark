import { task } from "@trigger.dev/sdk/v3";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import { pipeline } from "stream/promises";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const extractAudioTask = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  run: async (payload: { videoUrl: string }) => {
    const outputDir = "/home/user/ffmpeg-task/output";
    const videoPath = path.join(outputDir, "temp_video.mp4");
    const outputPath = path.join(outputDir, "audio.wav");

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the video
    console.log(`Downloading video from ${payload.videoUrl}...`);
    const response = await fetch(payload.videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    
    const fileStream = fs.createWriteStream(videoPath);
    await pipeline(response.body as any, fileStream);
    console.log(`Video downloaded to ${videoPath}`);

    // Extract audio using fluent-ffmpeg
    console.log(`Extracting audio to ${outputPath}...`);
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("pcm_s16le")
        .audioChannels(1)
        .audioFrequency(44100)
        .outputOptions('-f', 'wav')
        .output(outputPath)
        .on("end", () => {
          console.log("Audio extraction completed.");
          resolve(true);
        })
        .on("error", (err) => {
          console.error("Error during audio extraction:", err);
          reject(err);
        })
        .run();
    });

    return { success: true, outputPath };
  },
});
