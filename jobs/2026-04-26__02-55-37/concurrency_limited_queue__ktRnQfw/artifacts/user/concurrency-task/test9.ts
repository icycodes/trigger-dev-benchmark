import { tasks } from "@trigger.dev/sdk/v3";
async function run() {
  const result = await tasks.trigger("my-task", { id: "1" });
  console.log(result.id);
}
