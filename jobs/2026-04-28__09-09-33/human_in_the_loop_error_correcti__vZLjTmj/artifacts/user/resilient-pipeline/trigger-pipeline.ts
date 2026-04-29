import { tasks } from "@trigger.dev/sdk/v3";

async function run() {
  const handle = await tasks.trigger("resilient-pipeline-human_in_the_loop_error_correcti__vZLjTmj", { input: "initial data" });
  console.log(`Run ID: ${handle.id}`);
}

run().catch(console.error);
