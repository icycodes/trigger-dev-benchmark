# Trigger.dev Scheduled Data Sync

A Trigger.dev project that performs scheduled data synchronization from an external API.

## Project Setup

This project was set up using the Trigger.dev SDK for TypeScript background job scheduling.

### Task Details

- **Task ID**: `scheduled-sync-scheduled_sync__rg49sBB`
- **Schedule**: Runs every minute
- **Data Source**: JSON Placeholder API (https://jsonplaceholder.typicode.com/todos)
- **Functionality**: Fetches todos and logs the count of processed items

## Installation

```bash
npm install
```

## Configuration

Before running the project, ensure you have:

1. Configured Trigger.dev CLI credentials:
   ```bash
   mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json
   ```

2. Set the required environment variables:
   - `TRIGGER_PROJECT_REF`: Your Trigger.dev project reference
   - `TRIGGER_API_KEY`: Your Trigger.dev API key

## Usage

### Development Mode

Start the development server to watch for changes:

```bash
npm run dev
```

### Trigger Task Immediately

For testing purposes, you can trigger the task immediately:

```bash
npm run run-task
```

This will print the Run ID in the format: `Run ID: <run_id>`

## Project Structure

```
trigger-sync/
├── src/
│   └── trigger/
│       └── sync.ts           # Scheduled sync task
├── scripts/
│   └── trigger-task.js       # Script to trigger task immediately
├── trigger.config.ts         # Trigger.dev configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

## Task Implementation

The task (`src/trigger/sync.ts`) uses Trigger.dev's `schedules.task` API to:

1. Fetch data from the JSON Placeholder todos API
2. Process and count the items
3. Log the number of processed items using the task logger
4. Return a success status with the count

## License

ISC