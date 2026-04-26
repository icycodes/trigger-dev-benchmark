import { task, wait } from "@trigger.dev/sdk";
import fs from "fs";

// Read trial_id from file
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const aiContentGenerator = task({
  id: `ai-content-generator-${trialId}`,
  run: async (payload: { topic: string }) => {
    // Step 1: Simulate generating content
    console.log(`Generating content for topic: ${payload.topic}`);
    
    const generatedTitle = `The Ultimate Guide to ${payload.topic}`;
    const generatedSummary = `This comprehensive article covers everything you need to know about ${payload.topic}, from basics to advanced techniques.`;
    
    console.log("Generated content:");
    console.log(`Title: ${generatedTitle}`);
    console.log(`Summary: ${generatedSummary}`);
    
    // Step 2: Wait for human approval
    console.log("Waiting for human approval...");
    const approval = await wait.forToken({
      type: "content-approval",
      data: {
        title: generatedTitle,
        summary: generatedSummary,
        topic: payload.topic,
      },
    });
    
    // Step 3: Once approved, return content with approval flag
    console.log("Content approved!");
    
    return {
      title: generatedTitle,
      summary: generatedSummary,
      approved: true,
    };
  },
});