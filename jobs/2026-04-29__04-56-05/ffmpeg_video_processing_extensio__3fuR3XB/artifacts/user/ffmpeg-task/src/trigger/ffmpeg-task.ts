import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export const ffmpegExtractAudio = task({
  id: "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__3fuR3XB",
  run: async (payload: { videoUrl: string }) => {
    const outputPath = "/home/user/ffmpeg-task/output/audio.wav";
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const response = await fetch(payload.videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    return new Promise((resolve, reject) => {
      ffmpeg(response.body!)
        .toFormat("wav")
        .audioChannels(1)
        .audioFrequency(44100)
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .on("end", () => {
          console.log("FFmpeg processing finished");
          resolve({ audioPath: outputPath });
        })
        .save(outputPath);
    });
  },
});
