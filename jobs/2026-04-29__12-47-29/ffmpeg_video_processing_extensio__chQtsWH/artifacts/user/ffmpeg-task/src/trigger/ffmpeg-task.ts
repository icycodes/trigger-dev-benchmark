import { task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import fetch from "node-fetch";

const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const extractAudioTask = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  run: async (payload: { videoUrl: string }) => {
    const outputDir = "/home/user/ffmpeg-task/output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = `${outputDir}/audio.wav`;

    console.log(`Downloading video from ${payload.videoUrl}`);
    const response = await fetch(payload.videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    return new Promise((resolve, reject) => {
      ffmpeg(response.body as any)
        .audioChannels(1)
        .audioFrequency(44100)
        .format("wav")
        .save(outputPath)
        .on("end", () => {
          console.log(`Audio successfully extracted and saved to ${outputPath}`);
          resolve({ success: true, outputPath });
        })
        .on("error", (err) => {
          console.error(`FFmpeg error: ${err.message}`);
          reject(err);
        });
    });
  },
});
