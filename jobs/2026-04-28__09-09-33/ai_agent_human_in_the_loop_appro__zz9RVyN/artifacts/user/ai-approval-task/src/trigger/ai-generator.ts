import { task, wait } from "@trigger.dev/sdk";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_agent_human_in_the_loop_appro__zz9RVyN",
  run: async (payload: { topic: string, waitpointToken: string }) => {
    console.log("Generating content for payload:", payload);
    
    const generatedContent = {
      title: "How to use Trigger.dev",
      summary: "A brief guide on using Trigger.dev for background jobs."
    };

    console.log("Content generated, waiting for approval...");

    // Wait for a token-based approval
    const approval = await wait.forToken<{ approved: boolean }>(payload.waitpointToken).unwrap();

    console.log("Approval received:", approval);

    if (approval.approved) {
      return {
        ...generatedContent,
        approved: true
      };
    } else {
      return {
        ...generatedContent,
        approved: false
      };
    }
  }
});
