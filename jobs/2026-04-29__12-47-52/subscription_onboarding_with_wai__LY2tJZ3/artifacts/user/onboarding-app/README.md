# Durable Subscription Onboarding with Waitpoints

This Next.js application demonstrates user onboarding with email verification using Trigger.dev's Waitpoints feature.

## Features

- User sign-up form with email input
- Trigger.dev workflow that pauses execution at a waitpoint
- Real-time status polling to display onboarding progress
- Simulated email verification that completes the waitpoint token
- Responsive UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ installed
- Trigger.dev project credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your Trigger.dev credentials:
```
TRIGGER_PROJECT_REF=your_project_ref
TRIGGER_SECRET_KEY=your_secret_key
TRIGGER_API_URL=https://api.trigger.dev
```

### Trigger.dev Setup

Before running the application, ensure your Trigger.dev project is set up:

1. Install Trigger.dev CLI and configure credentials:
```bash
mkdir -p ~/.config/trigger
printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json
chmod 600 ~/.config/trigger/config.json
```

2. Verify CLI connection:
```bash
npx trigger.dev@latest whoami
```

3. Type-check the trigger config:
```bash
npx tsc --skipLibCheck --noEmit trigger.config.ts
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## How It Works

1. **User Sign-up**: User enters their email and clicks "Start Onboarding"
2. **Workflow Trigger**: The app triggers the `onboarding-workflow-subscription_onboarding_with_wai__LY2tJZ3` task
3. **Waitpoint Creation**: The workflow creates a waitpoint token and pauses execution
4. **Status Polling**: The frontend polls the Trigger.dev API every 2 seconds to check the run status
5. **Email Verification**: User clicks "Simulate Email Verification" to complete the token
6. **Workflow Resumes**: The waitpoint completes and the workflow updates the status to "Active"

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── onboard/route.ts    # Triggers the onboarding workflow
│   │   ├── status/route.ts     # Polls run status
│   │   └── verify/route.ts     # Completes the waitpoint token
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main sign-up page
│   └── globals.css             # Global styles
├── trigger/
│   └── onboarding.ts           # Trigger.dev workflow definition
├── trigger.config.ts           # Trigger.dev configuration
├── package.json
└── README.md
```

## API Endpoints

### POST /api/onboard
Triggers the onboarding workflow.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "runId": "run_abc123",
  "status": "EXECUTING",
  "tokenId": "token_xyz789"
}
```

### GET /api/status?runId={runId}
Fetches the current status of an onboarding run.

**Response:**
```json
{
  "id": "run_abc123",
  "status": "EXECUTING",
  "metadata": {
    "status": "Waiting for verification",
    "email": "user@example.com",
    "tokenId": "token_xyz789"
  }
}
```

### POST /api/verify?token={tokenId}
Completes the waitpoint token to simulate email verification.

**Response:**
```json
{
  "success": true,
  "message": "Token completed successfully",
  "data": { ... }
}
```

## License

MIT