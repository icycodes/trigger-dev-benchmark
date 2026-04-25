import { exclusiveTask } from "../src/trigger/queue";

async function main() {
  const [run1, run2, run3] = await Promise.all([
    exclusiveTask.trigger({ id: "1" }),
    exclusiveTask.trigger({ id: "2" }),
    exclusiveTask.trigger({ id: "3" }),
  ]);

  console.log(`Run IDs: ${run1.id}, ${run2.id}, ${run3.id}`);
}

main().catch(console.error);
