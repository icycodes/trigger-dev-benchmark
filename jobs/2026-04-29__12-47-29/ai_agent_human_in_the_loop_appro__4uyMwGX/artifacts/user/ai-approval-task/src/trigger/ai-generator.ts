import { task, wait } from "@trigger.dev/sdk/v3";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_agent_human_in_the_loop_appro__4uyMwGX",
  run: async (payload: { tokenId: string; prompt?: string }) => {
    console.log("Generating content for prompt:", payload.prompt);
    
    // 1. Simulate generating content
    const content = {
      title: "Trigger.dev AI Approval",
      summary: "This is a summary of the AI generated content.",
    };

    console.log("Content generated. Waiting for approval...");

    // 2. Use wait.forToken() to pause execution
    // wait.forToken() pauses the run until the token is completed
    const result = await wait.forToken(payload.tokenId);

    console.log("Approval received:", result);

    // 3. Once approved, return the content with an approved: true flag
    return {
      ...content,
      approved: true,
      approvalResult: result
    };
  },
});
