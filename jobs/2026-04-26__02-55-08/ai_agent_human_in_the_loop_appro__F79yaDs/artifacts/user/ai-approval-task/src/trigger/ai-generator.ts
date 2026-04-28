import { task, wait } from "@trigger.dev/sdk/v3";

export const aiContentGenerator = task({
  id: "ai-content-generator-ai_agent_human_in_the_loop_appro__F79yaDs",
  run: async (payload: { topic: string }) => {
    console.log(`Generating content for topic: ${payload.topic}`);
    
    // Simulate content generation
    const content = {
      title: `The Future of ${payload.topic}`,
      summary: `An in-depth look at how ${payload.topic} is changing the world.`
    };

    console.log("Content generated, waiting for approval...");

    // Use wait.forToken() to pause execution and wait for human approval
    const result = await wait.forToken("human-approval");

    console.log("Received approval result:", result);

    return {
      ...content,
      approved: true,
      approvalData: result
    };
  },
});
