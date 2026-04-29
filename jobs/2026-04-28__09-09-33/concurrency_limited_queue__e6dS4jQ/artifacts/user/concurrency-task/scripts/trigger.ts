import { tasks } from "@trigger.dev/sdk/v3";
import { exclusiveTask } from "../src/trigger/queue";

async function main() {
  const ids = ["1", "2", "3"];
  
  const results = await Promise.all(
    ids.map((id) => tasks.trigger<typeof exclusiveTask>(exclusiveTask.id, { id }))
  );

  console.log(`Run IDs: ${results.map(r => r.id).join(", ")}`);
}

main().catch(console.error);
