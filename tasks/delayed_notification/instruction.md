# Delayed Notification with Trigger.dev

## Background
Trigger.dev's `wait.for` allows tasks to pause execution for a specific duration without consuming compute resources during the wait period.

## Requirements
- Create a Trigger.dev project in `/home/user/notify-app`.
- Define a task with ID: `delayed-notify-${trial_id}`.
- The task should accept a `userId` and `message`.
- The task should wait for 10 seconds using `wait.for({ seconds: 10 })`.
- After the wait, it should return an object with `sent: true` and the original `message`.

## Implementation Guide
1. Initialize project in `/home/user/notify-app`.
2. Create `trigger/notify.ts`.
3. Import `wait` from `@trigger.dev/sdk`.
4. Implement the delay and return the result.

## Constraints
- Project path: /home/user/notify-app
- Wait duration: 10 seconds.

## Integrations
- Trigger.dev
