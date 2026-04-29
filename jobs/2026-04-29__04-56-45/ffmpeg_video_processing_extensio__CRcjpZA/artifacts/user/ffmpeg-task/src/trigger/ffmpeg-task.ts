import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

const TASK_ID = "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__CRcjpZA";

export const ffmpegExtractAudio = task({
  id: TASK_ID,
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;
    const outputPath = "/home/user/ffmpeg-task/output/audio.wav";
    const tempVideoPath = "/home/user/ffmpeg-task/output/temp_video.mp4";

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the video
    console.log(`Downloading video from: ${videoUrl}`);
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempVideoPath, buffer);
    console.log(`Video downloaded to: ${tempVideoPath}`);

    // Extract audio and convert to WAV format (mono, 44.1kHz)
    console.log("Extracting audio and converting to WAV...");
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .noVideo()
        .audioChannels(1) // mono
        .audioFrequency(44100) // 44.1kHz
        .audioCodec("pcm_s16le") // WAV codec
        .format("wav")
        .on("end", () => {
          console.log("Audio extraction completed");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during audio extraction:", err);
          reject(err);
        })
        .save(outputPath);
    });

    // Clean up temporary video file
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
      console.log(`Temporary video file deleted: ${tempVideoPath}`);
    }

    console.log(`Audio saved to: ${outputPath}`);

    return {
      success: true,
      outputPath,
    };
  },
});