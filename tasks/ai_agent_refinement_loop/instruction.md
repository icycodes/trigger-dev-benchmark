# AI Agent Refinement Loop

## Background
Trigger.dev's `ai.tool` allows you to expose tasks as tools for AI agents. You can build refinement loops where an agent calls a tool, evaluates the output, and calls it again if needed.

## Requirements
- Create a Trigger.dev project in `/home/user/ai-app`.
- Define a `schemaTask` called `refine-text-${trial_id}` that takes a string and improves it (mocked or using a real LLM if configured, but here we check the integration).
- Wrap this task using `ai.tool(refineTask)`.
- Define a parent task `agent-loop-${trial_id}` that uses this tool in a loop to refine a text at least twice.

## Implementation Guide
1. Initialize project in `/home/user/ai-app`.
2. Create `trigger/ai-agent.ts`.
3. Use `ai.tool` from `@trigger.dev/sdk`.

## Constraints
- Project path: /home/user/ai-app
- Use `ai.tool`.

## Integrations
- Trigger.dev
