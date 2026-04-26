import { task } from "@trigger.dev/sdk/v3";
import * as fs from "fs/promises";

const STATUS_FILE = "/home/user/ai-workflow/status.json";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_workflow_cancellation_handler__nnBXTy4",
  onCancel: async (params) => {
    console.log("Task was cancelled.", params.task);
    await fs.writeFile(STATUS_FILE, JSON.stringify({ status: "cancelled" }));
  },
  run: async (payload: any, { ctx, signal }) => {
    const controller = new AbortController();
    
    // Wire up the task's AbortSignal to our AbortController
    signal.addEventListener("abort", () => {
      controller.abort();
    });

    await fs.writeFile(STATUS_FILE, JSON.stringify({ status: "started" }));

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => resolve(), 20000);
        
        controller.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Aborted"));
        });
      });

      if (!controller.signal.aborted) {
        await fs.writeFile(STATUS_FILE, JSON.stringify({ status: "completed" }));
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Aborted") {
        return;
      }
      throw error;
    }
  }
});
