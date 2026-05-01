# Batch Processing with Results Aggregation in Trigger.dev

This project demonstrates batch processing with results aggregation using Trigger.dev. It implements a parent task that triggers multiple child tasks in parallel and waits for all of them to complete before returning a summary.

## Project Structure

```
/home/user/batch-task/
├── package.json
├── tsconfig.json
├── trigger.config.ts
└── src/
    ├── run-task.ts
    └── trigger/
        └── tasks.ts
```

## Tasks

### process-item
- **ID**: `process-item-batch_processing_with_results_ag__hbur3hR`
- **Purpose**: Simulates processing an item by squaring a number with a 1-second delay
- **Input**: `{ number: number }`
- **Output**: The square of the input number

### batch-process
- **ID**: `batch-process-batch_processing_with_results_ag__hbur3hR`
- **Purpose**: Triggers multiple `process-item` tasks in parallel and aggregates their results
- **Input**: `{ numbers: number[] }`
- **Output**: The sum of all squared numbers

## Running the Task

To trigger the `batch-process` task with the input `[1, 2, 3, 4, 5]`, run:

```bash
cd /home/user/batch-task
npm run run-task
```

This will print the `Run ID` of the triggered task.

## Environment Setup

Make sure the following environment variables are set:

- `TRIGGER_PROJECT_REF`: Your Trigger.dev project reference
- `TRIGGER_CREDENTIAL_CONFIG_JSON`: Your Trigger.dev credentials configuration

## Dependencies

- `@trigger.dev/sdk`: Trigger.dev SDK for task management
- `@trigger.dev/build`: Trigger.dev build tools
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution for development

## Configuration

The project is configured in `trigger.config.ts` with:
- Project reference from environment variable
- Task directory: `./src/trigger`
- Maximum duration: 3600 seconds
- Retry configuration for development