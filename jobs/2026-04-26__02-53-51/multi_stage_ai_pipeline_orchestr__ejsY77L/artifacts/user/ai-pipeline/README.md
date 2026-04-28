# Multi-Stage AI Pipeline with Trigger.dev

This project implements a multi-stage AI pipeline using Trigger.dev's orchestration capabilities.

## Features

- **Stage 1 (Sequential)**: Generates a 100-word summary of a research topic
- **Stage 2 (Parallel)**: Translates the summary to multiple languages concurrently using `batchTriggerAndWait`
- **Stage 3 (Aggregation)**: Combines all translations into a final report

## Task IDs

All tasks use the trial ID suffix: `multi_stage_ai_pipeline_orchestr__ejsY77L`

- `generate-summary-multi_stage_ai_pipeline_orchestr__ejsY77L`: Mock summary generation
- `translate-summary-multi_stage_ai_pipeline_orchestr__ejsY77L`: Mock translation
- `research-pipeline-multi_stage_ai_pipeline_orchestr__ejsY77L`: Orchestrator task

## Setup

1. Configure Trigger.dev CLI credentials:
   ```bash
   mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set the `TRIGGER_PROJECT_REF` environment variable

## Usage

Run the pipeline with the default payload:
```bash
npm run run-task
```

This will trigger the `research-pipeline` task with:
- Topic: "Artificial Intelligence"
- Languages: ["Spanish", "French", "German"]

## Architecture

The pipeline uses Trigger.dev's orchestration features:
- `triggerAndWait`: For sequential task execution (Stage 1)
- `batchTriggerAndWait`: For parallel task execution (Stage 2)
- All tasks are named exports for proper registration