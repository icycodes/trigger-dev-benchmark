const { tasks, wait } = require("@trigger.dev/sdk/v3");
const { readFileSync } = require("node:fs");

const trialId = readFileSync("/logs/trial_id", "utf8").trim();
const taskId = `ai-content-generator-${trialId}`;

async function main() {
  const token = await wait.createToken({
    timeout: "24h",
    tags: ["approval", taskId],
  });

  const handle = await tasks.trigger(taskId, {
    topic: "human-in-the-loop AI content",
    approvalToken: token.id,
  });

  console.log(`Run ID: ${handle.id}`);
  console.log(`Token: ${token.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
