# Human-in-the-Loop Approval Workflow

## Background
Trigger.dev supports pausing workflows for human intervention using `wait.forToken`.

## Requirements
- Create a Trigger.dev project in `/home/user/approval-app`.
- Define a task `approval-workflow-${trial_id}`.
- The task should generate a token using `wait.forToken("manager-approval")`.
- The task should return the data received from the token completion.

## Implementation Guide
1. Initialize project in `/home/user/approval-app`.
2. Create `trigger/approval.ts`.
3. Use `const { data } = await wait.forToken("manager-approval")`.

## Constraints
- Project path: /home/user/approval-app
- Use `wait.forToken`.

## Integrations
- Trigger.dev
