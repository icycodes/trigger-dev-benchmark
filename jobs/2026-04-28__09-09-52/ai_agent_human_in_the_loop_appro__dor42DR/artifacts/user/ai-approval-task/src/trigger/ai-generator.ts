import { task, wait } from "@trigger.dev/sdk";

const TRIAL_ID = "ai_agent_human_in_the_loop_appro__dor42DR";

interface GeneratedContent {
  title: string;
  summary: string;
  approved: boolean;
}

export const aiContentGeneratorTask = task({
  id: `ai-content-generator-${TRIAL_ID}`,
  run: async (payload: any) => {
    // Step 1: Simulate generating content
    const generatedContent = {
      title: "The Future of AI-Powered Workflows",
      summary: "Explore how artificial intelligence is revolutionizing the way we build and manage background job workflows, enabling more efficient and human-in-the-loop processes.",
    };

    // Step 2: Wait for human approval
    // The waitpoint token will be generated and can be used to resume the task
    const approvalResult = await wait.forToken({
      type: "approval",
      metadata: {
        title: generatedContent.title,
        summary: generatedContent.summary,
      },
    });

    // Step 3: Return content with approval status
    return {
      ...generatedContent,
      approved: true,
      approvalData: approvalResult,
    };
  },
});