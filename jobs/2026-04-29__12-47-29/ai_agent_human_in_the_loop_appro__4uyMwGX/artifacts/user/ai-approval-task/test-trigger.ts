import { tasks } from "@trigger.dev/sdk/v3";
async function run() {
  try {
    const handle = await tasks.trigger("ai-content-generator-ai_agent_human_in_the_loop_appro__4uyMwGX", { test: true });
    console.log(handle);
  } catch(e) {
    console.error(e);
  }
}
run().then(() => console.log("Done"));
