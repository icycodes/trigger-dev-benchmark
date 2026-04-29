import { task } from "@trigger.dev/sdk/v3";
export const t = task({ id: "t", run: async () => 1 });
async function test() {
  const result: number = await t.triggerAndWait().unwrap();
}
