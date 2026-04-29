import { batchProcessTask } from "./trigger/tasks";

async function main() {
  const handle = await batchProcessTask.trigger({ numbers: [1, 2, 3, 4, 5] });
  console.log(`Run ID: ${handle.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
