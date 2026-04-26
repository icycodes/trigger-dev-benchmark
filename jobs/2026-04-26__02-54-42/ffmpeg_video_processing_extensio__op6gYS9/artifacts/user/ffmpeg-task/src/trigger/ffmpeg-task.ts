import { task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";
import path from "path";
import { pipeline } from "stream/promises";

type FfmpegPayload = {
  videoUrl: string;
};

const trialId = (() => {
  try {
    return fs.readFileSync("/logs/trial_id", "utf-8").trim();
  } catch (error) {
    return "unknown";
  }
})();

const taskId = `ffmpeg-extract-audio-${trialId}`;

async function getFetch() {
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }

  const { default: fetch } = await import("node-fetch");
  return fetch;
}

function runFfmpeg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(44100)
      .format("wav")
      .on("end", () => resolve())
      .on("error", (error) => reject(error))
      .save(outputPath);
  });
}

export const ffmpegExtractAudio = task({
  id: taskId,
  run: async (payload: FfmpegPayload, { logger }) => {
    const outputDir = "/home/user/ffmpeg-task/output";
    const outputPath = path.join(outputDir, "audio.wav");

    await fs.promises.mkdir(outputDir, { recursive: true });

    const fetch = await getFetch();
    const response = await fetch(payload.videoUrl);

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Video response body is empty");
    }

    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "ffmpeg-task-"));
    const inputPath = path.join(tempDir, "input-video");

    await pipeline(response.body as NodeJS.ReadableStream, fs.createWriteStream(inputPath));

    logger.info("Downloaded video, starting ffmpeg conversion", {
      inputPath,
      outputPath,
    });

    await runFfmpeg(inputPath, outputPath);

    await fs.promises.unlink(inputPath).catch(() => undefined);
    await fs.promises.rmdir(tempDir).catch(() => undefined);

    logger.info("Audio extraction complete", { outputPath });

    return { outputPath };
  },
});
