import { task } from "@trigger.dev/sdk";
import { readFileSync } from "fs";
import fs from "fs/promises";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const statusFile = "/home/user/ai-workflow/status.json";

const abortControllers = new Map<string, AbortController>();

const writeStatus = async (status: string) => {
  await fs.writeFile(statusFile, JSON.stringify({ status }, null, 2));
};

const simulateAiGeneration = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => resolve(), 20000);

    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error("AI generation aborted"));
    });
  });

export const aiContentGenerator = task({
  id: `ai-content-generator-${trialId}`,
  run: async (_payload, { logger, runId }) => {
    const controller = new AbortController();
    abortControllers.set(runId, controller);

    await writeStatus("started");
    logger.info("AI content generation started.");

    try {
      await simulateAiGeneration(controller.signal);
      await writeStatus("completed");
      logger.info("AI content generation completed.");
    } catch (error) {
      if (controller.signal.aborted) {
        logger.warn("AI content generation aborted.");
        return;
      }

      throw error;
    } finally {
      abortControllers.delete(runId);
    }
  },
  onCancel: async (_payload, { logger, runId }) => {
    const controller = abortControllers.get(runId);
    if (controller && !controller.signal.aborted) {
      controller.abort();
    }

    logger.info("AI content generation cancelled.");
    await writeStatus("cancelled");
  }
});
