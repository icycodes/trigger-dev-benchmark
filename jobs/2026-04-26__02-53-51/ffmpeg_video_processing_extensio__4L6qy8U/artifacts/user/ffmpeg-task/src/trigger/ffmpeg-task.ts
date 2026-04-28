import { task } from "@trigger.dev/sdk";
const ffmpeg = require("fluent-ffmpeg");
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

// Define the task with the trial_id suffix
export const ffmpegExtractAudio = task({
  id: "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__4L6qy8U",
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    console.log(`Downloading video from: ${videoUrl}`);

    // Download the video
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const videoPath = path.join(tempDir, "input.mp4");
    const audioPath = path.join(__dirname, "../../output/audio.wav");

    // Save the video file
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(videoPath, buffer);

    console.log(`Video saved to: ${videoPath}`);

    // Extract audio using ffmpeg
    console.log("Extracting audio and converting to WAV (mono, 44.1kHz)...");

    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .toFormat("wav")
        .audioChannels(1) // mono
        .audioFrequency(44100) // 44.1kHz
        .on("end", () => {
          console.log("Audio extraction completed successfully");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during audio extraction:", err);
          reject(err);
        })
        .save(audioPath);
    });

    // Clean up temp video file
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log(`Cleaned up temporary video file: ${videoPath}`);
    }

    console.log(`Audio file saved to: ${audioPath}`);

    return {
      success: true,
      audioPath,
      message: "Audio extraction completed successfully",
    };
  },
});