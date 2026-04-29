import { tasks } from "@trigger.dev/sdk/v3";
async function run() {
    const trialId = "resilient_webhook_idempotency__tySjqkp";
    const taskId = `webhook-handler-${trialId}`;
    const idempotencyKey = `key-${Date.now()}`;
    const amount = 100;
    console.log(`Triggering task twice with idempotencyKey: ${idempotencyKey}`);
    // Trigger twice in quick succession
    const run1Promise = tasks.trigger(taskId, {
        idempotencyKey,
        amount
    }, { idempotencyKey });
    const run2Promise = tasks.trigger(taskId, {
        idempotencyKey,
        amount
    }, { idempotencyKey });
    const [run1, run2] = await Promise.all([run1Promise, run2Promise]);
    console.log(`Run ID 1:: ${run1.id}, Run ID 2: ${run2.id}`);
}
run().catch(console.error);
