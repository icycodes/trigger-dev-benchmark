import { tasks } from "@trigger.dev/sdk/v3";
import { exclusiveTask } from "./src/trigger/queue";
async function test() {
  const r = await tasks.trigger<typeof exclusiveTask>("abc", { id: "1" });
  console.log(r.id);
}
