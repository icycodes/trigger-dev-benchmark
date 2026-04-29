import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const outputDir = "/home/user/ffmpeg-task/output";
const outputAudioPath = path.join(outputDir, "audio.wav");

export const ffmpegExtractAudio = task({
  id: `ffmpeg-extract-audio-${trialId}`,
  run: async (payload: { videoUrl: string }) => {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const videoPath = path.join(outputDir, `source-${Date.now()}.mp4`);
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(payload.videoUrl);

    if (!response.ok || !response.body) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
    }

    await pipeline(response.body, fs.createWriteStream(videoPath));

    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .audioChannels(1)
        .audioFrequency(44100)
        .format("wav")
        .on("end", () => resolve())
        .on("error", (error) => reject(error))
        .save(outputAudioPath);
    });

    return {
      audioPath: outputAudioPath,
    };
  },
});
