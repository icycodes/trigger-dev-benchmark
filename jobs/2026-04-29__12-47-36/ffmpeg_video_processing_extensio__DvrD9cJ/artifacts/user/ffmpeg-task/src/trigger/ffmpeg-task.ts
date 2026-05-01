import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { pipeline } from "stream";

const streamPipeline = promisify(pipeline);

export const ffmpegExtractAudio = task({
  id: "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__DvrD9cJ",
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;
    const tempVideoPath = path.join("/tmp", `video-${Date.now()}.mp4`);
    const outputDir = "/home/user/ffmpeg-task/output";
    const outputPath = path.join(outputDir, "audio.wav");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the video
    // @ts-ignore
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    // @ts-ignore
    await streamPipeline(response.body, fs.createWriteStream(tempVideoPath));

    // Process with ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(44100)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // Clean up temp file
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }

    return {
      audioPath: outputPath,
    };
  },
});
