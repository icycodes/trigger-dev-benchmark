import { task } from '@trigger.dev/sdk/v3';
export const t = task({ id: "t", run: async () => 1 });
async function run() {
    const res = await t.triggerAndWait();
    console.log(res);
}
