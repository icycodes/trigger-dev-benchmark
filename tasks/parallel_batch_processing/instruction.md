# Parallel Batch Processing

## Background
Trigger.dev V4 does not support `Promise.all` for task triggers. Instead, you must use `batch.triggerByTaskAndWait` to run sub-tasks in parallel.

## Requirements
- Create a Trigger.dev project in `/home/user/batch-app`.
- Define a sub-task `process-item-${trial_id}` that accepts an `id` and returns it.
- Define a parent task `batch-processor-${trial_id}` that takes an array of IDs.
- Use `batch.triggerByTaskAndWait` to process all IDs in parallel using the sub-task.
- Return the array of results.

## Implementation Guide
1. Initialize project in `/home/user/batch-app`.
2. Define tasks in `trigger/batch.ts`.
3. Import `batch` from `@trigger.dev/sdk`.
4. Use `await batch.triggerByTaskAndWait(...)`.

## Constraints
- Project path: /home/user/batch-app
- Use `batch.triggerByTaskAndWait` (NOT `Promise.all`).

## Integrations
- Trigger.dev
