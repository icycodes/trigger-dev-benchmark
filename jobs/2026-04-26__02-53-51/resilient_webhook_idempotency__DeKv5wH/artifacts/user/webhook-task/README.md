# Resilient Webhook Handler with Idempotency

This project demonstrates a webhook handler implementation using Trigger.dev with idempotency support to prevent duplicate processing of webhook events.

## Features

- **Idempotency**: Uses idempotency keys to ensure that a webhook is only processed once, even if triggered multiple times
- **Simulated Processing**: Includes a 2-second delay to simulate real-world processing work
- **Duplicate Detection**: Demonstrates how duplicate triggers with the same idempotency key return cached results

## Project Structure

```
webhook-task/
├── src/
│   └── trigger/
│       └── webhook.ts          # The webhook handler task
├── trigger.config.ts            # Trigger.dev project configuration
├── trigger-webhook.ts           # Script to trigger the task twice
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set required environment variables:
   ```bash
   export TRIGGER_API_KEY="your-api-key"
   export TRIGGER_PROJECT_REF="your-project-ref"
   ```

## Usage

Run the webhook trigger script:
```bash
npm run run-task
```

This will:
1. Build the TypeScript code
2. Trigger the webhook handler task twice with the same idempotency key
3. Display the run IDs for both triggers

## How It Works

### Webhook Handler Task (`src/trigger/webhook.ts`)

The task accepts a payload with:
- `idempotencyKey`: A unique identifier for the webhook event
- `amount`: The payment amount to process

The task:
1. Simulates processing with a 2-second delay
2. Returns a success response with the processed timestamp and amount

### Trigger Script (`trigger-webhook.ts`)

The script:
1. Configures the Trigger.dev client with the API key
2. Triggers the task twice with the same idempotency key ("payment-12345")
3. Due to idempotency, only the first trigger will execute the actual task logic
4. The second trigger will return the cached result from the first execution

## Idempotency

Idempotency is achieved by:
- Using a consistent `idempotencyKey` in the trigger options
- Trigger.dev automatically caches the result of the first execution
- Subsequent triggers with the same key return the cached result without re-executing

This is crucial for:
- Preventing duplicate payments
- Avoiding duplicate data synchronization
- Ensuring consistent results in distributed systems

## Task ID

The task ID is suffixed with the trial ID from `/logs/trial_id`:
```
webhook-handler-resilient_webhook_idempotency__DeKv5wH
```

## License

ISC