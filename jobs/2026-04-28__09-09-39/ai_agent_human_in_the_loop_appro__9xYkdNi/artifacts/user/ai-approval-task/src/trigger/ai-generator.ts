import { task, wait } from "@trigger.dev/sdk";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_agent_human_in_the_loop_appro__9xYkdNi",
  run: async (payload: { title: string; summary: string }) => {
    console.log("Generating content...", payload);

    // Simulate content generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Pause for human approval
    const result = await wait.forToken("approval-token");

    console.log("Approval received!", result);

    return {
      ...payload,
      approved: true,
      approvalResult: result,
    };
  },
});
