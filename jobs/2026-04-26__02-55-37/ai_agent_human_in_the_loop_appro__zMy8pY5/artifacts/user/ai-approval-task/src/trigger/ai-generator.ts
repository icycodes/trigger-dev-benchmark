import { task, wait } from "@trigger.dev/sdk/v3";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_agent_human_in_the_loop_appro__zMy8pY5",
  run: async (payload: { tokenId: string, [key: string]: any }) => {
    // 1. Simulate generating content
    const content = {
      title: "AI and the Future of Work",
      summary: "A blog post about how AI is changing the workplace.",
      ...payload
    };

    // 2. Use wait.forToken() to pause execution and wait for a human approval.
    const approval = await wait.forToken<{ status: string, comment: string }>(payload.tokenId).unwrap();

    // 3. Once approved, return the content with an approved: true flag.
    return {
      ...content,
      approved: true,
      approvalData: approval
    };
  }
});
