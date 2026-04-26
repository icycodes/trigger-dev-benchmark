import { tasks, wait } from "@trigger.dev/sdk/v3";

async function main() {
  const token = await wait.createToken({
    timeout: "1h",
  });

  const run = await tasks.trigger("ai-content-generator-ai_agent_human_in_the_loop_appro__zMy8pY5", {
    tokenId: token.id
  });

  console.log(`Run ID: ${run.id}`);
  console.log(`Token: ${token.id}`);
}

main().catch(console.error);
