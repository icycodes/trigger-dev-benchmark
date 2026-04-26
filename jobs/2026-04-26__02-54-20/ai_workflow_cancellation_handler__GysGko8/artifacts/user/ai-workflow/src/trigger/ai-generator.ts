import { task } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

const STATUS_FILE = "/home/user/ai-workflow/status.json";
const TRIAL_ID = "ai_workflow_cancellation_handler__GysGko8";
export const TASK_ID = `ai-content-generator-${TRIAL_ID}`;

/**
 * Simulates a long-running AI content generation process.
 * Resolves when done, or rejects with an AbortError if the signal fires.
 */
function simulateAIGeneration(signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutMs = 20_000; // 20 seconds
    const timer = setTimeout(() => {
      resolve("AI content generated successfully.");
    }, timeoutMs);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      const err = new Error("AI generation aborted");
      err.name = "AbortError";
      reject(err);
    });
  });
}

function writeStatus(status: string): void {
  const dir = path.dirname(STATUS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ status }), "utf-8");
  console.log(`[ai-content-generator] Status written: ${status}`);
}

export const aiContentGenerator = task({
  id: TASK_ID,

  onCancel: async () => {
    console.log("[ai-content-generator] onCancel hook triggered — cancelling AI generation.");
    writeStatus("cancelled");
  },

  run: async (_payload: unknown, { signal }: { signal: AbortSignal }) => {
    console.log(`[ai-content-generator] Task started. Task ID: ${TASK_ID}`);
    writeStatus("started");

    try {
      const result = await simulateAIGeneration(signal);
      console.log(`[ai-content-generator] ${result}`);
      writeStatus("completed");
      return { status: "completed", message: result };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("[ai-content-generator] Task was aborted via signal.");
        // onCancel hook will handle writing the cancelled status
        throw err;
      }
      throw err;
    }
  },
});
