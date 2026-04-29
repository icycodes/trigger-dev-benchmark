# Durable Subscription Onboarding with Waitpoints

This Next.js application demonstrates user onboarding with Trigger.dev's Waitpoints feature. It allows users to sign up and go through a verification process that pauses workflow execution until verification is complete.

## Features

- **Sign-up Form**: Users can enter their email to start the onboarding process
- **Trigger.dev Integration**: Automatically triggers an onboarding workflow with waitpoints
- **Status Polling**: Real-time status updates by polling Trigger.dev run metadata
- **Email Verification Simulation**: A button to simulate email verification by completing the waitpoint token
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## How It Works

1. **User Signs Up**: User enters their email and clicks "Start Onboarding"
2. **Workflow Triggered**: The app triggers a Trigger.dev task named `onboarding-workflow-${trial_id}`
3. **Waitpoint Created**: The workflow creates a waitpoint token and pauses execution
4. **Status Display**: The UI polls the workflow status every 2 seconds
5. **Verification**: User clicks "Simulate Email Verification" to complete the waitpoint token
6. **Onboarding Complete**: The workflow resumes and sets status to "Active"

## Project Structure

```
onboarding-app/
├── app/
│   ├── api/
│   │   ├── onboarding/
│   │   │   └── route.ts          # Triggers the onboarding workflow
│   │   ├── status/
│   │   │   └── route.ts          # Fetches workflow status
│   │   └── verify/
│   │       └── route.ts          # Completes waitpoint token
│   ├── page.tsx                  # Main UI with sign-up form and status
│   └── layout.tsx
├── src/
│   └── trigger/
│       ├── index.ts              # Trigger.dev client configuration
│       └── onboarding.ts         # Onboarding workflow with waitpoints
├── .env.local                    # Environment variables
├── package.json
└── trigger.config.ts             # Trigger.dev project configuration
```

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Update `.env.local` with your Trigger.dev credentials:
     ```
     TRIGGER_PROJECT_REF=your_project_ref
     TRIGGER_API_KEY=your_api_key
     TRIAL_ID=your_trial_id
     ```

3. **Configure Trigger.dev CLI**:
   ```bash
   mkdir -p ~/.config/trigger
   printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json
   chmod 600 ~/.config/trigger/config.json
   npx trigger.dev@latest whoami
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Trigger.dev Workflow

The `onboarding-workflow-${TRIAL_ID}` task:

1. Sets run metadata to `{"status": "Waiting for verification"}`
2. Creates a waitpoint token with 1-hour timeout
3. Stores the token ID in metadata for the frontend to access
4. Pauses execution using `wait.forToken(token)`
5. Once token is completed, updates metadata to `{"status": "Active"}`

## API Endpoints

### POST /api/onboarding
Triggers the onboarding workflow.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "runId": "run_abc123",
  "message": "Onboarding started successfully"
}
```

### GET /api/status?runId={runId}
Fetches the current status of the onboarding workflow.

**Response**:
```json
{
  "status": "WAITING",
  "metadata": {
    "status": "Waiting for verification",
    "email": "user@example.com",
    "tokenId": "token_xyz789"
  }
}
```

### POST /api/verify?token={tokenId}
Completes the waitpoint token to simulate email verification.

**Response**:
```json
{
  "success": true,
  "message": "Token completed successfully"
}
```

## Technologies Used

- **Next.js 16**: React framework for the web application
- **Trigger.dev SDK**: Workflow orchestration with waitpoints
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript

## License

This project is part of a trial demonstration for Trigger.dev Waitpoints feature.