# Scheduled Cleanup Task

## Background
Trigger.dev supports scheduled tasks (cron) for recurring jobs like database cleanup or cache invalidation.

## Requirements
- Create a Trigger.dev project in `/home/user/cleanup-app`.
- Define a scheduled task with ID: `cleanup-task-${trial_id}`.
- The task should run every hour (`0 * * * *`).
- The task's `run` function should log a message: `"Cleaning up resources for trial ${trial_id}..."`.
- The task should be correctly exported.

## Implementation Guide
1. Initialize a Trigger.dev project in `/home/user/cleanup-app`.
2. Read the `trial_id` from `/logs/trial_id`.
3. Create a file `trigger/cleanup.ts` and use `schedules.task` (or the equivalent V4 scheduled task API).
4. Ensure the task ID is suffixed with `trial_id`.

## Constraints
- Project path: /home/user/cleanup-app
- Schedule: `0 * * * *` (hourly).
- Task ID must include `${trial_id}` suffix.

## Integrations
- Trigger.dev
