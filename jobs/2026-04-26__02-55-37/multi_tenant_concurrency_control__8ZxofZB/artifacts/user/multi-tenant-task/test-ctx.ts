import { task } from "@trigger.dev/sdk/v3";
export const myTask = task({
  id: "t",
  run: async (payload: any, { ctx }) => {
    return ctx;
  }
});
