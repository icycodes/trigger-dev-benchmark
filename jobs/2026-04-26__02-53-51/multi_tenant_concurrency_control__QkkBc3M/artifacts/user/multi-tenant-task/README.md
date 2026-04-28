# Multi-Tenant Concurrency Control with Trigger.dev

This project demonstrates how to implement multi-tenant concurrency control using Trigger.dev Queues and concurrency keys.

## Setup

1. Copy the `.env.example` file to `.env` and fill in your Trigger.dev credentials:
   ```bash
   cp .env.example .env
   ```

2. Make sure you have the following environment variables set:
   - `TRIGGER_PROJECT_REF`: Your Trigger.dev project reference
   - `TRIGGER_API_KEY`: Your Trigger.dev API key
   - `TRIGGER_API_URL`: Trigger.dev API URL (defaults to https://api.trigger.dev)

## Project Structure

- `src/trigger/multi_tenant.ts`: Defines the multi-tenant task with queue and concurrency control
- `src/trigger/index.ts`: Trigger client configuration
- `src/index.ts`: Script to trigger task instances
- `trigger.config.ts`: Trigger.dev project configuration

## Queue Configuration

The project defines a queue with:
- **ID**: `multi-tenant-queue-multi_tenant_concurrency_control__QkkBc3M`
- **Global Concurrency Limit**: 10 (total concurrent tasks across all users)

## Task Configuration

The task `multi-tenant-task-multi_tenant_concurrency_control__QkkBc3M`:
- Uses the defined multi-tenant queue
- Implements per-user concurrency control using `concurrencyKey` based on `userId`
- Limits concurrency to **1 task per user**
- Accepts a payload with `userId` and `jobId`
- Simulates work by sleeping for 5 seconds
- Returns `userId`, `jobId`, `startedAt`, and `finishedAt` timestamps

## Usage

To trigger 4 task instances (2 for user_A, 2 for user_B) in parallel:

```bash
npm run run-task
```

This will:
1. Trigger 4 task instances simultaneously:
   - user_A: jobId A1, A2
   - user_B: jobId B1, B2
2. Print the Run IDs in the format: `Run IDs: <id_A1>, <id_A2>, <id_B1>, <id_B2>`

## Concurrency Behavior

- **Global Concurrency**: Maximum 10 tasks can run simultaneously (across all users)
- **Per-User Concurrency**: Maximum 1 task can run per user at a time
- For the demo with 4 tasks (2 per user), user_A tasks will run sequentially (A1 then A2), and user_B tasks will run sequentially (B1 then B2)
- However, user_A and user_B tasks can run in parallel with each other

## Trial Information

- **Trial ID**: `multi_tenant_concurrency_control__QkkBc3M`
- All queue and task IDs are suffixed with this trial ID