import { tasks } from "@trigger.dev/sdk/v3";
async function x() {
  const r = await tasks.trigger("abc", {});
  console.log(r.id);
}
