import { runs, tasks } from "@trigger.dev/sdk/v3";

const trialId = "python_extension_data_processing__g6QuiKd";
const taskId = `python-process-${trialId}`;
const payload = [10, 20, 30, 40, 50];

async function main() {
  const handle = await tasks.trigger(taskId, payload);
  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
