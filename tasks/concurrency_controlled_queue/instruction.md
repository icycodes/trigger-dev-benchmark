# Concurrency Control with Queues

## Background
Trigger.dev V4 requires queues to be explicitly defined. You can use queues to limit concurrency globally or per key.

## Requirements
- Create a Trigger.dev project in `/home/user/queue-app`.
- Define a queue named `critical-queue-${trial_id}` with `concurrencyLimit: 1`.
- Define a task `exclusive-task-${trial_id}` that uses this queue.
- The task should also use a `concurrencyKey` based on the payload's `resourceId` to ensure only one run per resource ID.

## Implementation Guide
1. Initialize project in `/home/user/queue-app`.
2. Create `trigger/queue.ts`.
3. Use `queue({ name: ..., concurrencyLimit: 1 })`.
4. Set `queue` and `concurrencyKey` in the task definition.

## Constraints
- Project path: /home/user/queue-app
- Queue concurrency limit: 1.
- Use `concurrencyKey`.

## Integrations
- Trigger.dev
