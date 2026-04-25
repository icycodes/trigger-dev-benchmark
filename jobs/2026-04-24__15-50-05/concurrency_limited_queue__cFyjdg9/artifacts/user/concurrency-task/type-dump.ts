import { task } from "@trigger.dev/sdk/v3";
export const exclusiveTask = task({
  id: "exclusive-task-concurrency_limited_queue__cFyjdg9",
  run: async (payload: { id: string }, { ctx }) => {
    let dummy: Parameters<Parameters<typeof task>[0]["run"]>[1]["ctx"];
  },
});
