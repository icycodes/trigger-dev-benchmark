import { task } from "@trigger.dev/sdk/v3";
const myTask = task({
  id: "test-task",
  run: async () => {}
});
console.log("Task created");
console.log("Trigger:", typeof (myTask as any).trigger);
