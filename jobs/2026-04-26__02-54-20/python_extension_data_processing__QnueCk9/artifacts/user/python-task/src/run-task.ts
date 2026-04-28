import { tasks } from "@trigger.dev/sdk/v3";

const trialId = "python_extension_data_processing__QnueCk9";
const taskId = `python-process-${trialId}`;
const payload = [10, 20, 30, 40, 50];

async function main() {
  const handle = await tasks.trigger(taskId, payload);
  process.stdout.write(`Run ID: ${handle.id}\n`);
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
