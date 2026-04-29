import { runs } from "@trigger.dev/sdk/v3";
import { resilientPipeline } from "../src/trigger/tasks.js";

async function main() {
  const handle = await resilientPipeline.trigger({ input: "initial data" });
  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
