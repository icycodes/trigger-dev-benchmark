import { tasks } from "@trigger.dev/sdk/v3";
async function test() {
  const result = await tasks.triggerAndWait("some-task", {});
  if (result.ok) {
    console.log(result.output);
  } else {
    console.log(result.error);
  }
}
