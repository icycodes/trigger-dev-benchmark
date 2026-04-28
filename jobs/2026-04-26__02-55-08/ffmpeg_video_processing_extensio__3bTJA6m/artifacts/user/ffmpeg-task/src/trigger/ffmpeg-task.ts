import { logger, task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { pipeline } from "stream/promises";

export const ffmpegExtractAudioTask = task({
  id: "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__3bTJA6m",
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;
    const outputDir = "/home/user/ffmpeg-task/output";
    const outputPath = join(outputDir, "audio.wav");

    await mkdir(outputDir, { recursive: true });

    logger.info("Downloading video...", { videoUrl });
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const tempVideoPath = join(outputDir, "temp_video.mp4");
    const fileStream = createWriteStream(tempVideoPath);
    await pipeline(response.body as any, fileStream);

    logger.info("Extracting audio with FFmpeg...");
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .toFormat("wav")
        .audioChannels(1)
        .audioFrequency(44100)
        .on("end", () => {
          logger.info("Audio extraction completed.");
          resolve();
        })
        .on("error", (err) => {
          logger.error("FFmpeg error:", { error: err.message });
          reject(err);
        })
        .save(outputPath);
    });

    return {
      message: "Audio extracted successfully",
      path: outputPath,
    };
  },
});
