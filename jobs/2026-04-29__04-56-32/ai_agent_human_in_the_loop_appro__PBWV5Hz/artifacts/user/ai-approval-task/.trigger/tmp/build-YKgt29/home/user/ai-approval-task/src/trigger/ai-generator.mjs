import {
  task,
  wait
} from "../../../../../chunk-3VDQZP4A.mjs";
import "../../../../../chunk-MZMYRHEF.mjs";
import {
  __name,
  init_esm
} from "../../../../../chunk-YNHHDKFZ.mjs";

// src/trigger/ai-generator.ts
init_esm();
var trialId = process.env.TRIAL_ID ?? "default";
var TASK_ID = `ai-content-generator-${trialId}`;
var aiContentGeneratorTask = task({
  id: TASK_ID,
  maxDuration: 3600,
  run: /* @__PURE__ */ __name(async (payload) => {
    const topic = payload.topic ?? "Artificial Intelligence";
    const author = payload.author ?? "AI Assistant";
    console.log(`Generating AI content for topic: "${topic}"...`);
    const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const title = `The Future of ${topic}: Opportunities, Challenges, and What Lies Ahead`;
    const summary = `In this comprehensive blog post, we explore the rapidly evolving landscape of ${topic}. From groundbreaking innovations to ethical considerations, we dive deep into how ${topic} is reshaping industries and what professionals need to know to stay ahead of the curve. Written by ${author} on ${generatedAt}.`;
    console.log("Content generated successfully.");
    console.log(`  Title: ${title}`);
    console.log(`  Summary (preview): ${summary.slice(0, 80)}...`);
    console.log("Creating waitpoint token for human approval...");
    const token = await wait.createToken({
      timeout: "1h",
      tags: ["approval", `topic:${topic}`]
    });
    console.log(`Waitpoint token created: ${token.id}`);
    console.log(`WAITPOINT_TOKEN=${token.id}`);
    console.log("Pausing task and waiting for human approval...");
    const approvalResult = await wait.forToken(token);
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
    return {
      title,
      summary,
      topic,
      author,
      generatedAt,
      approved: true
    };
  }, "run")
});
export {
  aiContentGeneratorTask
};
//# sourceMappingURL=ai-generator.mjs.map
