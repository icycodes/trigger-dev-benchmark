import { runs } from "@trigger.dev/sdk/v3";

async function main() {
  const run = await runs.retrieve("run_cmoeuu9687hjb0hoe9qqt4xgt");
  console.log("Status:", run.status);
  console.log("Output:", JSON.stringify(run.output, null, 2));
}
main().catch(console.error);
