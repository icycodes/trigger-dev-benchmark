# Complex Media Processing Pipeline

## Background
Building robust pipelines requires orchestrating multiple steps with error handling and resource cleanup.

## Requirements
- Create a Trigger.dev project in `/home/user/media-app`.
- Define a pipeline task `media-pipeline-${trial_id}` that performs three steps:
    1. Trigger `download-task` and wait for result.
    2. Trigger `process-task` with the download result and wait.
    3. Trigger `upload-task` with the process result and wait.
- Implement a `try-catch` block around the orchestration to log errors and return a failure status if any step fails.
- Use `batch.triggerByTaskAndWait` if any step can be parallelized (e.g., uploading to multiple destinations).

## Implementation Guide
1. Initialize project in `/home/user/media-app`.
2. Create `trigger/media.ts`.
3. Implement the sequential triggers with error handling.

## Constraints
- Project path: /home/user/media-app
- Implement 3 discrete steps.
- Use robust error handling.

## Integrations
- Trigger.dev
