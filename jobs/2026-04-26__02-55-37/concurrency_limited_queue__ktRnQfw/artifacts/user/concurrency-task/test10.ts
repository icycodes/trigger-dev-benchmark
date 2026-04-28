import { tasks } from "@trigger.dev/sdk";
async function run() {
  const result = await tasks.trigger("my-task", { id: "1" });
  console.log(result.id);
}
