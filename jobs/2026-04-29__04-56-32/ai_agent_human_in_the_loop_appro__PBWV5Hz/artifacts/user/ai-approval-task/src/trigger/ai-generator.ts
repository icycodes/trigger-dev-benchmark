import { task, wait } from "@trigger.dev/sdk/v3";

// The trial_id is injected as an environment variable at deploy/run time
const trialId = process.env.TRIAL_ID ?? "default";

const TASK_ID = `ai-content-generator-${trialId}`;

export interface ContentPayload {
  topic?: string;
  author?: string;
}

export interface GeneratedContent {
  title: string;
  summary: string;
  topic: string;
  author: string;
  generatedAt: string;
  approved: boolean;
}

export const aiContentGeneratorTask = task({
  id: TASK_ID,
  maxDuration: 3600,
  run: async (payload: ContentPayload): Promise<GeneratedContent> => {
    const topic = payload.topic ?? "Artificial Intelligence";
    const author = payload.author ?? "AI Assistant";

    // Step 1: Simulate content generation
    console.log(`Generating AI content for topic: "${topic}"...`);

    const generatedAt = new Date().toISOString();

    const title = `The Future of ${topic}: Opportunities, Challenges, and What Lies Ahead`;
    const summary =
      `In this comprehensive blog post, we explore the rapidly evolving landscape of ${topic}. ` +
      `From groundbreaking innovations to ethical considerations, we dive deep into how ${topic} ` +
      `is reshaping industries and what professionals need to know to stay ahead of the curve. ` +
      `Written by ${author} on ${generatedAt}.`;

    console.log("Content generated successfully.");
    console.log(`  Title: ${title}`);
    console.log(`  Summary (preview): ${summary.slice(0, 80)}...`);

    // Step 2: Create a waitpoint token for human approval
    console.log("Creating waitpoint token for human approval...");

    const token = await wait.createToken({
      timeout: "1h",
      tags: ["approval", `topic:${topic}`],
    });

    console.log(`Waitpoint token created: ${token.id}`);
    console.log(`WAITPOINT_TOKEN=${token.id}`);

    // Step 3: Pause execution and wait for human approval via the token
    console.log("Pausing task and waiting for human approval...");

    const approvalResult = await wait.forToken<{ approved: boolean }>(token);

    if (!approvalResult.ok) {
      throw new Error(
        `Waitpoint timed out or failed: ${approvalResult.error?.message ?? "unknown error"}`
      );
    }

    const approved = approvalResult.output?.approved ?? false;

    console.log(`Approval response received. Approved: ${approved}`);

    if (!approved) {
      throw new Error("Content was rejected by the human reviewer.");
    }

    // Step 4: Return the approved content
    return {
      title,
      summary,
      topic,
      author,
      generatedAt,
      approved: true,
    };
  },
});
