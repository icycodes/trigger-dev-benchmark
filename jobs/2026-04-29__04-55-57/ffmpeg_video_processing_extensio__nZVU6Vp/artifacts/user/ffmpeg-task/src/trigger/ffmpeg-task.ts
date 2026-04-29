import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

export const extractAudio = task({
  id: "ffmpeg-extract-audio-ffmpeg_video_processing_extensio__nZVU6Vp",
  run: async (payload: { videoUrl: string }) => {
    const videoUrl = payload.videoUrl;
    const outputDir = "/home/user/ffmpeg-task/output";
    const tempVideoPath = path.join(outputDir, "temp_video.mp4");
    const outputAudioPath = path.join(outputDir, "audio.wav");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download video
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
    if (!response.body) throw new Error("No response body");
    
    await pipeline(response.body, fs.createWriteStream(tempVideoPath));

    // Process with FFmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(44100)
        .format("wav")
        .output(outputAudioPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    // Clean up temp video
    if (fs.existsSync(tempVideoPath)) {
      fs.unlinkSync(tempVideoPath);
    }
    
    return { success: true, path: outputAudioPath };
  }
});
