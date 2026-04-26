import { task } from "@trigger.dev/sdk";
export const myTask = task({
  id: "exclusive-task",
  run: async (payload: { id: string }, { ctx }) => {
    console.log(Object.keys(ctx));
  }
});
