import { task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream/promises";

const TRIAL_ID = fs.readFileSync("/logs/trial_id", "utf-8").trim();
const OUTPUT_DIR = "/home/user/ffmpeg-task/output";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "audio.wav");

export const ffmpegExtractAudio = task({
  id: `ffmpeg-extract-audio-${TRIAL_ID}`,
  maxDuration: 300,
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Download the video to a temp file
    console.log(`Downloading video from: ${videoUrl}`);
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const tmpFile = path.join(os.tmpdir(), `input-video-${Date.now()}.mp4`);
    const fileStream = fs.createWriteStream(tmpFile);
    await pipeline(response.body as NodeJS.ReadableStream, fileStream);
    console.log(`Video downloaded to: ${tmpFile}`);

    // Extract audio using fluent-ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpFile)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(44100)
        .audioCodec("pcm_s16le")
        .format("wav")
        .on("start", (cmd: string) => {
          console.log(`FFmpeg started: ${cmd}`);
        })
        .on("progress", (progress: { percent?: number }) => {
          console.log(`Processing: ${progress.percent?.toFixed(1) ?? "?"}% done`);
        })
        .on("end", () => {
          console.log(`Audio extracted successfully to: ${OUTPUT_FILE}`);
          resolve();
        })
        .on("error", (err: Error) => {
          console.error(`FFmpeg error: ${err.message}`);
          reject(err);
        })
        .save(OUTPUT_FILE);
    });

    // Clean up temp file
    fs.unlinkSync(tmpFile);

    return {
      outputFile: OUTPUT_FILE,
      taskId: `ffmpeg-extract-audio-${TRIAL_ID}`,
    };
  },
});
