import { tasks } from "@trigger.dev/sdk";
import { readFileSync } from "fs";

async function run() {
  const trial_id = "human_in_the_loop_error_correcti__dBdSiJ4";
  const handle = await tasks.trigger(`resilient-pipeline-${trial_id}`, {
    input: "initial data",
  });
  console.log(`Run ID: ${handle.id}`);
}

run().catch(console.error);
