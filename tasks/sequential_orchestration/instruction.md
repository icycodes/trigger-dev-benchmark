# Sequential Task Orchestration

## Background
In Trigger.dev V4, you can trigger sub-tasks and wait for their completion using `triggerAndWait`. This returns a `Result` object that must be unwrapped.

## Requirements
- Create a Trigger.dev project in `/home/user/orch-app`.
- Define two tasks: `sub-task-1-${trial_id}` and `parent-task-${trial_id}`.
- `sub-task-1` should just return `{ success: true }`.
- `parent-task` should trigger `sub-task-1` using `triggerAndWait()`, unwrap the result, and then return `{ subTaskResult: result }`.

## Implementation Guide
1. Initialize project in `/home/user/orch-app`.
2. Define both tasks in `trigger/orchestration.ts`.
3. Use `await subTask.triggerAndWait()`.
4. Call `.unwrap()` on the result.

## Constraints
- Project path: /home/user/orch-app
- Use `triggerAndWait` and `.unwrap()`.

## Integrations
- Trigger.dev
