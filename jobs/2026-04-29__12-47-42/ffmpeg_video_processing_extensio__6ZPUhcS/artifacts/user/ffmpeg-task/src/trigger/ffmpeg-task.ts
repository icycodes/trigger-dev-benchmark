import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import { task } from "@trigger.dev/sdk";

const OUTPUT_DIR = "/home/user/ffmpeg-task/output";
const OUTPUT_AUDIO_PATH = path.join(OUTPUT_DIR, "audio.wav");
const INPUT_VIDEO_PATH = path.join(OUTPUT_DIR, "input-video");

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ffmpeg-extract-audio-${trialId}`;

export const ffmpegExtractAudio = task({
  id: taskId,
  run: async (payload: { videoUrl: string }) => {
    await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });

    const response = await fetch(payload.videoUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
    }

    await pipeline(response.body, fs.createWriteStream(INPUT_VIDEO_PATH));

    await new Promise<void>((resolve, reject) => {
      ffmpeg(INPUT_VIDEO_PATH)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(44100)
        .format("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(OUTPUT_AUDIO_PATH);
    });

    return {
      outputPath: OUTPUT_AUDIO_PATH,
    };
  },
});
