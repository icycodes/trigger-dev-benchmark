import { resilientPipeline } from "../trigger/tasks.js";

async function main() {
  const run = await resilientPipeline.trigger({ input: "initial data" });
  console.log(`Run ID: ${run.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
