import { task } from "@trigger.dev/sdk/v3";
export const t = task({
  id: "test",
  queue: {
    name: "test-queue",
    // @ts-ignore
    concurrencyKey: (payload: any) => payload.userId
  },
  run: async () => {}
});
console.log(t);
