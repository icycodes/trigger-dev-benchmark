import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import os from "os";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

export const ffmpegExtractAudio = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  maxDuration: 300,
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    // Ensure output directory exists
    const outputDir = "/home/user/ffmpeg-task/output";
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "audio.wav");

    // Download the video to a temp file
    console.log(`Downloading video from: ${videoUrl}`);
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const tmpDir = os.tmpdir();
    const tmpVideoPath = path.join(tmpDir, `video-${Date.now()}.mp4`);

    const buffer = await response.buffer();
    fs.writeFileSync(tmpVideoPath, buffer);
    console.log(`Video downloaded to: ${tmpVideoPath}`);

    // Extract audio using fluent-ffmpeg
    console.log(`Extracting audio to: ${outputPath}`);
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpVideoPath)
        .noVideo()
        .audioChannels(1)          // mono
        .audioFrequency(44100)     // 44.1 kHz
        .toFormat("wav")
        .on("start", (cmd: string) => console.log(`FFmpeg command: ${cmd}`))
        .on("progress", (progress: { percent?: number }) => {
          if (progress.percent !== undefined) {
            console.log(`Processing: ${progress.percent.toFixed(1)}%`);
          }
        })
        .on("end", () => {
          console.log("Audio extraction completed.");
          resolve();
        })
        .on("error", (err: Error) => {
          console.error("FFmpeg error:", err.message);
          reject(err);
        })
        .save(outputPath);
    });

    // Clean up temp file
    fs.unlinkSync(tmpVideoPath);

    return {
      outputPath,
      message: "Audio extracted successfully",
    };
  },
});
