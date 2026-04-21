# Real-time Progress Updates

## Background
You can report progress in Trigger.dev by updating the run's metadata. This can be viewed in real-time on the dashboard or fetched via the Realtime API.

## Requirements
- Create a Trigger.dev project in `/home/user/progress-app`.
- Define a task `progress-task-${trial_id}`.
- The task should simulate a long-running process with a loop (e.g., 5 steps).
- In each step, it should update the metadata with the current progress percentage: `await ctx.run.updateMetadata({ progress: currentProgress })`.

## Implementation Guide
1. Initialize project in `/home/user/progress-app`.
2. Create `trigger/progress.ts`.
3. Use `ctx.run.updateMetadata` inside the task's `run` function.

## Constraints
- Project path: /home/user/progress-app
- Update metadata with `progress` key.

## Integrations
- Trigger.dev
