import { task, wait } from "@trigger.dev/sdk/v3";

// trial_id is injected as an environment variable at build time
const trialId = process.env.TRIAL_ID!;

export const aiContentGeneratorTask = task({
  id: `ai-content-generator-${trialId}`,
  maxDuration: 3600,
  run: async (payload: { topic?: string; runTag?: string }) => {
    const topic = payload.topic ?? "AI in Modern Software Development";

    // Step 1: Simulate AI content generation
    console.log(`Generating content for topic: "${topic}"`);

    // Simulate a brief delay for content generation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const generatedContent = {
      title: `The Future of ${topic}: Insights and Perspectives`,
      summary:
        `This blog post explores how ${topic} is transforming the industry. ` +
        `We examine key trends, challenges, and opportunities that practitioners face today. ` +
        `From automation to intelligent systems, the landscape is evolving rapidly, ` +
        `offering unprecedented possibilities for innovation and growth.`,
      generatedAt: new Date().toISOString(),
    };

    console.log("Content generated successfully. Awaiting human approval...");
    console.log("Title:", generatedContent.title);
    console.log("Summary:", generatedContent.summary);

    // Step 2: Create a waitpoint token tagged with runTag so we can look it up
    const tags = payload.runTag ? [`run:${payload.runTag}`] : [];
    const token = await wait.createToken({
      timeout: "1h",
      tags,
    });

    console.log("Waitpoint token created:", token.id);

    // Step 3: Pause execution and wait for the token to be completed
    const result = await wait.forToken<{ approved: boolean; feedback?: string }>(
      token
    );

    // Step 4: Return the content with the approval status
    if (result.ok) {
      const approvalData = result.output;
      return {
        ...generatedContent,
        approved: approvalData?.approved ?? true,
        feedback: approvalData?.feedback,
        approvedAt: new Date().toISOString(),
      };
    } else {
      // Timed out or error
      return {
        ...generatedContent,
        approved: false,
        error: "Waitpoint timed out or failed",
        approvedAt: new Date().toISOString(),
      };
    }
  },
});
