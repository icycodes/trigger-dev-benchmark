import { task } from "@trigger.dev/sdk/v3";
import * as fs from "fs";
import * as path from "path";

const STATUS_FILE = "/home/user/ai-workflow/status.json";

function updateStatus(status: string) {
  const dir = path.dirname(STATUS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ status }));
}

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_workflow_cancellation_handler__GrZE2b9",
  run: async (payload: any, { ctx, signal }) => {
    console.log("Task started");
    updateStatus("started");

    // Simulated long-running AI process
    const simulatedAIProcess = async (signal: AbortSignal) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          resolve("AI content generated");
        }, 20000);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("AI process aborted"));
        });
      });
    };

    try {
      await simulatedAIProcess(signal);
      console.log("Task completed");
      updateStatus("completed");
      return { status: "completed" };
    } catch (error: any) {
      if (error.name === "AbortError" || error.message === "AI process aborted") {
        console.log("AI process was aborted internally");
      }
      throw error;
    }
  },
  onCancel: async (...args: any[]) => {
    console.log("Task cancelled via onCancel hook");
    updateStatus("cancelled");
  },
});
