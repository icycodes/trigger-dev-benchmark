import { webhookHandler } from "./src/trigger/webhook";

async function main() {
  const idempotencyKey = "test-payment-12345";
  const amount = 99.99;

  console.log("Triggering webhook task twice with the same idempotency key...");
  console.log(`Idempotency Key: ${idempotencyKey}`);
  console.log(`Amount: ${amount}`);
  console.log("");

  // Trigger the task twice with the same idempotency key
  console.log("Triggering task execution 1...");
  const run1 = await webhookHandler.trigger(
    { idempotencyKey, amount },
    { idempotencyKey }
  );
  console.log(`Run 1 started with ID: ${run1.id}`);

  console.log("");

  console.log("Triggering task execution 2...");
  const run2 = await webhookHandler.trigger(
    { idempotencyKey, amount },
    { idempotencyKey }
  );
  console.log(`Run 2 started with ID: ${run2.id}`);

  console.log("");
  console.log("Summary:");
  console.log(`Run ID 1: ${run1.id}, Run ID 2: ${run2.id}`);
  
  console.log("");
  console.log("Idempotency verification:");
  if (run1.id === run2.id) {
    console.log("✓ Both triggers returned the same run ID (idempotency working!)");
    console.log("This means the second trigger returned the existing run instead of creating a new one.");
  } else {
    console.log("✗ Triggers returned different run IDs");
  }
}

main().catch(console.error);