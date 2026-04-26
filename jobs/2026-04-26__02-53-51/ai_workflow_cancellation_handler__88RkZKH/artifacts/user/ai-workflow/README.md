# AI Workflow with Cancellation Handler

This project demonstrates an AI content generation workflow using Trigger.dev with cancellation support.

## Setup

### 1. Configure CLI Credentials

Before using the Trigger.dev CLI, create the configuration file:

```bash
mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Set the `TRIGGER_PROJECT_REF` environment variable with your project ref from the Trigger.dev dashboard.

## Usage

### Run the Task

Trigger the AI content generation task:

```bash
npm run run-task
```

This will output a Run ID that you can use to cancel the task.

### Cancel the Task

Cancel a running task using its Run ID:

```bash
npm run cancel-task -- <runId>
```

## Task Details

- **Task ID**: `ai-content-generator-{trial_id}`
- **Duration**: 20 seconds (simulated AI generation)
- **Status File**: `/home/user/ai-workflow/status.json`

The task writes its status to `status.json` with the following states:
- `started`: Task has begun execution
- `completed`: Task finished successfully
- `cancelled`: Task was cancelled by user
- `error`: Task encountered an error

## Implementation

The task uses:
- `AbortController` for cancellation signaling
- `onCancel` lifecycle hook for graceful cancellation handling
- Simulated 20-second AI content generation process
- Status tracking via JSON file

## Files

- `src/trigger/ai-generator.ts`: Main task definition with cancellation handling
- `scripts/trigger.ts`: Script to trigger the task
- `scripts/cancel.ts`: Script to cancel a running task
- `trigger.config.ts`: Trigger.dev project configuration
- `package.json`: Project dependencies and scripts