import { task } from "@trigger.dev/sdk";
import { z } from "zod";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

const trialId = "ffmpeg_video_processing_extensio__EgikCYE";

export const ffmpegExtractAudioTask = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  run: async ({ payload }) => {
    const { videoUrl } = payload;

    // Download the video
    console.log(`Downloading video from: ${videoUrl}`);
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());

    // Create a temporary file for the video
    const tempVideoPath = path.join(__dirname, "../../output/temp_video.mp4");
    const outputAudioPath = path.join(__dirname, "../../output/audio.wav");

    // Ensure output directory exists
    const outputDir = path.dirname(outputAudioPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the video buffer to a temporary file
    fs.writeFileSync(tempVideoPath, videoBuffer);

    console.log("Extracting audio and converting to WAV (mono, 44.1kHz)...");

    // Extract audio and convert to WAV format (mono, 44.1kHz)
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .toFormat("wav")
        .audioChannels(1) // mono
        .audioFrequency(44100) // 44.1kHz
        .audioCodec("pcm_s16le") // 16-bit PCM
        .on("end", () => {
          console.log("Audio extraction complete!");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during audio extraction:", err);
          reject(err);
        })
        .save(outputAudioPath);
    });

    // Clean up temporary video file
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }

    console.log(`Audio saved to: ${outputAudioPath}`);

    return {
      success: true,
      outputPath: outputAudioPath,
    };
  },
});