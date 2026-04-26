import { task } from "@trigger.dev/sdk";
import * as fs from "fs";
import * as path from "path";

// Read trial_id from /logs/trial_id
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

// Global abort controller for cancellation
let globalAbortController: AbortController | null = null;

// Simulated AI content generation function
async function simulateAIGeneration(
  signal: AbortSignal,
  duration: number = 20000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(checkInterval);
        reject(new Error("AI generation was cancelled"));
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(checkInterval);
        resolve("AI content generation completed successfully");
      }
    }, 100);
  });
}

// Function to update status file
function updateStatus(status: string): void {
  const statusPath = "/home/user/ai-workflow/status.json";
  const statusData = { status };
  fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
}

// Define the AI content generator task
export const aiContentGenerator = task({
  id: `ai-content-generator-${trialId}`,
  run: async ({ payload, ctx }) => {
    // Create abort controller and store it globally
    globalAbortController = new AbortController();
    
    try {
      // Update status to started
      updateStatus("started");
      
      // Simulate long-running AI content generation (20 seconds)
      const result = await simulateAIGeneration(globalAbortController.signal, 20000);
      
      // Update status to completed
      updateStatus("completed");
      
      // Clear the global abort controller
      globalAbortController = null;
      
      return {
        success: true,
        message: result,
      };
    } catch (error) {
      // Check if it was cancelled before clearing the controller
      const wasAborted = globalAbortController?.signal.aborted || false;
      
      // Clear the global abort controller
      globalAbortController = null;
      
      // Update status to cancelled if aborted
      if (wasAborted || (error instanceof Error && error.message === "AI generation was cancelled")) {
        updateStatus("cancelled");
        throw new Error("Task was cancelled by user");
      }
      
      // Otherwise, it's an error
      updateStatus("error");
      throw error;
    }
  },
  onCancel: async ({ payload, ctx }) => {
    // Log cancellation
    console.log("AI content generation task was cancelled");
    
    // Abort the ongoing operation
    if (globalAbortController) {
      globalAbortController.abort();
    }
    
    // Update status to cancelled
    updateStatus("cancelled");
    
    return {
      message: "Task was cancelled successfully",
    };
  },
});