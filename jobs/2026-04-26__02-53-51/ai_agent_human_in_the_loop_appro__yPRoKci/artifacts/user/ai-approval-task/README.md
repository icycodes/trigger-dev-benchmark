# AI Content Generator with Human-in-the-Loop Approval

This project demonstrates an AI content generation workflow with human-in-the-loop approval using Trigger.dev.

## Setup

1. Configure Trigger.dev CLI credentials:
   ```bash
   mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
   ```

2. Set environment variable:
   ```bash
   export TRIGGER_PROJECT_REF="<your-project-ref>"
   ```

## Usage

### Trigger the AI Content Generator Task

Run the following command to trigger the task:
```bash
npm run trigger-task
```

This will:
- Simulate generating content (blog post title and summary)
- Pause execution and wait for human approval
- Output the `run_id` and `waitpoint_token`

### Approve the Task

Once the task is waiting for approval, approve it using:
```bash
npm run approve-task <token>
```

Replace `<token>` with the waitpoint token from the trigger output.

## Task Details

The task `ai-content-generator-{trial_id}` performs the following steps:

1. **Content Generation**: Simulates generating a blog post title and summary for a given topic
2. **Wait for Approval**: Uses `wait.forToken()` to pause execution and wait for human approval
3. **Return Approved Content**: Once approved, returns the content with an `approved: true` flag

## Implementation

- **Task File**: `src/trigger/ai-generator.ts`
- **Trigger Script**: `src/trigger-task.ts`
- **Approval Script**: `src/approve-task.ts`
- **Config**: `trigger.config.ts`