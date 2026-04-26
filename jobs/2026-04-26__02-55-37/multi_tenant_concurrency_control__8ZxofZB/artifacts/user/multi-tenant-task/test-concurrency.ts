import { task } from "@trigger.dev/sdk/v3";
export const t = task({
  id: "t",
  queue: {
    name: "q",
    concurrencyLimit: 1,
    // @ts-ignore
    concurrencyKey: (payload: any) => payload.userId
  },
  run: async () => {}
});
