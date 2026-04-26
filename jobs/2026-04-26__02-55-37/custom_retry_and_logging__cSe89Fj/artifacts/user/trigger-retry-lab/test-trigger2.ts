import { tasks } from "@trigger.dev/sdk/v3";
async function test() {
  const handle = await tasks.trigger("retry-logic-task", { userId: "user_123" });
  console.log(handle.id);
}
