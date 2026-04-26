import { task, wait } from "@trigger.dev/sdk";

// trial_id is hardcoded at build time to isolate task IDs across trials
const TRIAL_ID = "ai_agent_human_in_the_loop_appro__5NCT3ER";

export const aiContentGenerator = task({
  id: `ai-content-generator-${TRIAL_ID}`,
  maxDuration: 3600,
  run: async (payload: { topic?: string }) => {
    const topic = payload.topic ?? "AI and the Future of Work";

    // Step 1: Simulate AI content generation
    console.log(`Generating content for topic: "${topic}"...`);

    const generatedContent = {
      title: `The Impact of AI on "${topic}": A Comprehensive Overview`,
      summary:
        `This blog post explores how artificial intelligence is transforming ${topic}. ` +
        `We examine current trends, real-world applications, and future projections, ` +
        `offering insights for professionals navigating this rapidly evolving landscape.`,
      topic,
      generatedAt: new Date().toISOString(),
    };

    console.log("Content generated. Waiting for human approval...");
    console.log("Generated title:", generatedContent.title);

    // Step 2: Pause and wait for a human to approve via a waitpoint token
    const approval = await wait.forToken<{ approved: boolean; reviewerNote?: string }>({
      timeout: "1h",
    });

    console.log("Received approval response:", approval);

    // Step 3: Return the content with the approval flag
    return {
      ...generatedContent,
      approved: approval.ok ? (approval.output?.approved ?? false) : false,
      reviewerNote: approval.ok ? (approval.output?.reviewerNote ?? null) : null,
      approvedAt: new Date().toISOString(),
    };
  },
});
