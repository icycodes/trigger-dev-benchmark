Trigger.dev V4 changed how concurrency is handled, requiring explicit queue definitions rather than inline creation on demand. This is vital for operations like synchronizing Stripe data sequentially per user.

You need to implement sequential processing for a `sync-stripe-customer` task by defining a specific queue and applying a dynamic concurrency key based on the payload.

**Constraints:**
- Explicitly define a queue named `stripe-sync` using the `queue()` function with a `concurrencyLimit` of 1 outside the task definition.
- Assign the explicitly defined queue to the task's configuration.
- Dynamically set the `concurrencyKey` within the task options to map to a `tenantId` provided in the task payload.