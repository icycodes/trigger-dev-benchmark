# AI Content Generator with Human-in-the-Loop Approval

This project demonstrates an AI content generation workflow using Trigger.dev that pauses for human approval before finalization.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your Trigger.dev credentials
```

## Usage

### Trigger the Task

Run the task to generate AI content:
```bash
npm run trigger-task
```

This will output:
- `Run ID`: The ID of the triggered task run
- `Token`: The token used for approval (same as run ID in this example)

### Approve the Task

Approve a pending task using the token:
```bash
npm run approve-task <token>
```

Replace `<token>` with the token from the trigger command output.

## Task Details

The `ai-content-generator` task:
1. Simulates generating content (blog post title and summary)
2. Uses `wait.forToken()` to pause execution and wait for human approval
3. Once approved, returns the content with an `approved: true` flag

## Task ID

The task ID is suffixed with the trial ID: `ai-agent-human-in-the-loop-appro__dor42DR`

Full task ID: `ai-content-generator-ai_agent_human_in_the_loop_appro__dor42DR`