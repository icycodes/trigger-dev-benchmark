# Basic Trigger.dev Task with Zod Validation

## Background
Trigger.dev allows you to define tasks with schema validation using Zod. This ensures that the data passed to the task is valid before execution.

## Requirements
- Create a Trigger.dev project in `/home/user/trigger-app`.
- Define a task using `schemaTask` with the following ID: `basic-zod-task-${trial_id}`.
- The task should accept a payload with a `name` (string) and `age` (number).
- The task should return a message: `"Hello ${name}, you are ${age} years old!"`.
- Configure the task with a retry strategy: `maxAttempts: 3`.

## Implementation Guide
1. Initialize a Trigger.dev project in `/home/user/trigger-app` using `npx trigger.dev@latest init -p $TRIGGER_PROJECT_REF`.
2. Read the `trial_id` from `/logs/trial_id`.
3. Create a file `trigger/basic-task.ts` (or similar) and export the task.
4. Use `zod` for the schema.
5. Ensure the task ID is correctly suffixed with `trial_id`.

## Constraints
- Project path: /home/user/trigger-app
- Use Zod for schema validation.
- Task ID must include `${trial_id}` suffix.

## Integrations
- Trigger.dev
