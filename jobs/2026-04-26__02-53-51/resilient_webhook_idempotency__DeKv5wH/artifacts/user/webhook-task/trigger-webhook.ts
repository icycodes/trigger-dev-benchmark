import { tasks, configure } from "@trigger.dev/sdk/v3";

// Configure the client with the API key
configure({
  accessToken: process.env.TRIGGER_API_KEY!,
});

async function triggerWebhook() {
  // Use a consistent idempotency key for both triggers
  const idempotencyKey = "payment-12345";
  const amount = 100;

  console.log("Triggering webhook task twice with the same idempotency key...");
  console.log(`Idempotency Key: ${idempotencyKey}`);
  console.log(`Amount: ${amount}\n`);

  // Trigger the task for the first time
  console.log("First trigger:");
  const run1 = await tasks.trigger(
    "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
    {
      idempotencyKey,
      amount,
    },
    {
      idempotencyKey,
    }
  );
  console.log(`Run ID: ${run1.id}\n`);

  // Trigger the task for the second time with the same idempotency key
  console.log("Second trigger (same idempotency key):");
  const run2 = await tasks.trigger(
    "webhook-handler-resilient_webhook_idempotency__DeKv5wH",
    {
      idempotencyKey,
      amount,
    },
    {
      idempotencyKey,
    }
  );
  console.log(`Run ID: ${run2.id}\n`);

  console.log("✅ Both triggers completed successfully!");
  console.log("\nDue to idempotency, only one execution should occur.");
  console.log("The second trigger should return the result from the first execution.");
  console.log("\nRun IDs:");
  console.log(`- First: ${run1.id}`);
  console.log(`- Second: ${run2.id}`);
}

triggerWebhook().catch((error) => {
  console.error("Error triggering webhook:", error);
  process.exit(1);
});