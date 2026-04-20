Trigger.dev tasks automatically handle retries, but specific external APIs often require custom backoff strategies to prevent rate-limiting.

You need to implement a standard task named `fetch-user-data` that takes a `userId` in its payload, calls a mock API, and handles potential failures by configuring an exponential backoff strategy within the task definition. 

**Constraints:**
- Use the standard `task` primitive from `@trigger.dev/sdk` (do not use `schemaTask`).
- The retry configuration must be explicitly defined in the task options with a maximum of 5 attempts.
- The retry backoff must start with a 2-second initial interval and use exponential multiplier logic.