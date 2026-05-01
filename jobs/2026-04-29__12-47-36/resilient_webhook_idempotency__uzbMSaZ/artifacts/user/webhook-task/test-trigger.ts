import { task } from "@trigger.dev/sdk/v3";
const myTask = task({
  id: "test-task",
  run: async () => {}
});
console.log("Task created");
try {
  const res = await (myTask as any).trigger();
  console.log("Triggered");
} catch (e) {
  console.log("Error type:", typeof e);
  console.log("Error:", e);
}
