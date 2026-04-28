# Durable Subscription Onboarding with Waitpoints

A Next.js web application that demonstrates user onboarding with Trigger.dev's Waitpoints feature. This application simulates a real-world SaaS onboarding flow where users need to verify their email address before their account becomes active.

## Features

- **User Sign-up Form**: Simple email-based sign-up that triggers an onboarding workflow
- **Trigger.dev Waitpoints**: Pauses workflow execution indefinitely without consuming compute resources
- **Real-time Status Polling**: Automatically polls and displays the current onboarding status
- **Simulated Email Verification**: A button to complete the waitpoint token and resume the workflow
- **Task Isolation**: Uses `trial_id` to isolate resources and prevent conflicts

## Architecture

### Trigger.dev Workflow

The application uses a Trigger.dev workflow named `onboarding-workflow-subscription_onboarding_with_wai__FJ64LJJ` that:

1. Sets run metadata to `{"status": "Waiting for verification"}`
2. Creates a waitpoint token with a 1-hour timeout
3. Pauses execution using `wait.forToken(token)`
4. Once the token is completed, sets status to `{"status": "Active"}`

### Application Components

- **Frontend** (`app/page.tsx`, `components/OnboardingForm.tsx`):
  - Sign-up form with email input
  - Real-time status display with polling every 2 seconds
  - "Simulate Email Verification" button when status is "Waiting for verification"
  - Success message when status becomes "Active"

- **API Routes**:
  - `POST /api/signup`: Triggers the onboarding workflow
  - `GET /api/run-status`: Polls the Trigger.dev run status
  - `POST /api/verify`: Completes the waitpoint token to resume the workflow

- **Trigger.dev Job** (`trigger/onboarding.ts`):
  - Defines the onboarding workflow with waitpoints
  - Handles metadata updates and token creation/completion

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Trigger.dev project set up with credentials

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
TRIGGER_PROJECT_REF=your_project_ref
TRIGGER_API_KEY=your_api_key
TRIGGER_SECRET_KEY=your_secret_key
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Trigger.dev CLI (if not already configured):
```bash
mkdir -p ~/.config/trigger
printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json
chmod 600 ~/.config/trigger/config.json
npx trigger.dev@latest whoami
```

3. Type-check the trigger configuration:
```bash
npx tsc --skipLibCheck --noEmit trigger.config.ts
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Flow

1. **Sign Up**: Enter your email address and click "Start Onboarding"
2. **Wait for Verification**: The workflow pauses at the waitpoint
3. **Check Status**: The UI automatically polls and displays "Waiting for verification"
4. **Simulate Verification**: Click the "Simulate Email Verification" button
5. **Completion**: The status updates to "Active" and the onboarding is complete

## Project Structure

```
onboarding-app/
├── app/
│   ├── api/
│   │   ├── signup/
│   │   │   └── route.ts          # Triggers the onboarding workflow
│   │   ├── run-status/
│   │   │   └── route.ts          # Polls run status from Trigger.dev
│   │   └── verify/
│   │       └── route.ts          # Completes the waitpoint token
│   ├── page.tsx                   # Main page component
│   └── layout.tsx                 # Root layout
├── components/
│   └── OnboardingForm.tsx         # Sign-up form with status polling
├── trigger/
│   └── onboarding.ts              # Trigger.dev workflow definition
├── trigger.config.ts              # Trigger.dev project configuration
├── .env.local                     # Environment variables (not in git)
└── package.json
```

## Key Concepts

### Waitpoints

Waitpoints allow you to pause workflow execution indefinitely without consuming compute resources. This is ideal for:

- Email verification flows
- Manual approval processes
- User interaction workflows
- Any process that requires external input

### Metadata

Run metadata is used to store and display custom information about the workflow run:

```typescript
await runs.metadata.update(ctx.run.id, {
  status: "Waiting for verification",
  email: payload.email,
});
```

### Task Isolation

The workflow ID is suffixed with the `trial_id` to isolate resources:

```typescript
const TRIAL_ID = "subscription_onboarding_with_wai__FJ64LJJ";

client.defineJob({
  id: `onboarding-workflow-${TRIAL_ID}`,
  // ...
});
```

## Troubleshooting

### Workflow Not Triggering

- Verify your Trigger.dev API credentials in `.env.local`
- Check that the Trigger.dev project is correctly configured
- Ensure the CLI is configured with `npx trigger.dev@latest whoami`

### Status Not Updating

- Check the browser console for errors
- Verify the API key has read permissions
- Ensure the run ID is being passed correctly to the status endpoint

### Verification Not Working

- Verify the token ID is being passed correctly
- Check that the API key has write permissions
- Ensure the waitpoint token hasn't expired (default timeout: 1 hour)

## Trigger.dev Resources

- [Official Documentation](https://trigger.dev/docs)
- [Waitpoints Guide](https://trigger.dev/docs/concepts/waitpoints)
- [Manual Setup Guide](https://trigger.dev/docs/manual-setup)

## License

MIT