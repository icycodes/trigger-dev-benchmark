import { task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { readFileSync } from "fs";

const trialId = readFileSync("/logs/trial_id", "utf-8").trim();

export const ffmpegExtractAudio = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    // Create output directory if it doesn't exist
    const outputDir = "/home/user/ffmpeg-task/output";
    fs.mkdirSync(outputDir, { recursive: true });

    // Download the video to a temp file
    const tmpVideoPath = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);
    const outputAudioPath = path.join(outputDir, "audio.wav");

    console.log(`Downloading video from: ${videoUrl}`);
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    // Write the video to a temp file
    const videoBuffer = await response.buffer();
    fs.writeFileSync(tmpVideoPath, videoBuffer);
    console.log(`Video downloaded to: ${tmpVideoPath}`);

    // Extract audio using fluent-ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpVideoPath)
        .noVideo()
        .audioChannels(1)        // mono
        .audioFrequency(44100)   // 44.1kHz
        .audioCodec("pcm_s16le") // WAV format
        .output(outputAudioPath)
        .on("start", (cmd) => {
          console.log(`FFmpeg command: ${cmd}`);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${JSON.stringify(progress)}`);
        })
        .on("end", () => {
          console.log(`Audio extracted to: ${outputAudioPath}`);
          resolve();
        })
        .on("error", (err) => {
          console.error(`FFmpeg error: ${err.message}`);
          reject(err);
        })
        .run();
    });

    // Clean up temp video file
    try {
      fs.unlinkSync(tmpVideoPath);
    } catch (e) {
      console.warn("Failed to clean up temp file:", e);
    }

    return {
      success: true,
      audioPath: outputAudioPath,
    };
  },
});
