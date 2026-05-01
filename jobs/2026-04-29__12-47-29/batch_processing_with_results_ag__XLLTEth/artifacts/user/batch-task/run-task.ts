import { tasks } from "@trigger.dev/sdk/v3";

async function main() {
  const trialId = "batch_processing_with_results_ag__XLLTEth";
  const runHandle = await tasks.trigger(`batch-process-${trialId}`, [1, 2, 3, 4, 5]);
  console.log(`Run ID: ${runHandle.id}`);
}

main().catch(console.error);
