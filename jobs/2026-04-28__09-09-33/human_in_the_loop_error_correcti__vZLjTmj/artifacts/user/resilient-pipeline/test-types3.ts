import { task } from '@trigger.dev/sdk/v3';
export const t = task({ id: "t", run: async () => 1 });
async function run() {
    const res = await t.triggerAndWait();
    if (res.ok) {
        console.log(res.output);
    } else {
        console.log(res.error);
    }
}
