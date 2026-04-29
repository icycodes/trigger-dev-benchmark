const { tasks } = require("@trigger.dev/sdk/v3");

const trialId = "batch_processing_with_results_ag__JQTbtKN";

async function main() {
  const handle = await tasks.trigger(`batch-process-${trialId}`, {
    values: [1, 2, 3, 4, 5],
  });

  console.log(`Run ID: ${handle.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
