# Multi-Stage AI Pipeline with Trigger.dev

This project implements a multi-stage AI pipeline using Trigger.dev orchestration capabilities.

## Project Structure

```
/home/user/ai-pipeline/
├── package.json
├── trigger.config.ts
├── src/
│   └── trigger/
│       └── pipeline.ts
└── README.md
```

## Tasks

### 1. generate-summary-multi_stage_ai_pipeline_orchestr__okj6f2Q
Generates a 100-word mock summary of a given topic.

**Payload:**
```json
{
  "topic": "string"
}
```

**Output:** `string` - The generated summary

### 2. translate-summary-multi_stage_ai_pipeline_orchestr__okj6f2Q
Translates a given text to a specified language (mock implementation).

**Payload:**
```json
{
  "text": "string",
  "language": "string"
}
```

**Output:**
```json
{
  "language": "string",
  "translation": "string"
}
```

### 3. research-pipeline-multi_stage_ai_pipeline_orchestr__okj6f2Q
Orchestrator task that coordinates the multi-stage pipeline:
- **Stage 1 (Sequential):** Generates a summary using `generate-summary` task
- **Stage 2 (Parallel):** Translates the summary to multiple languages using `batchTriggerAndWait`
- **Stage 3 (Aggregation):** Aggregates all translations into a final report

**Payload:**
```json
{
  "topic": "string",
  "languages": ["string"]
}
```

**Output:**
```json
{
  "originalSummary": "string",
  "translations": [
    {
      "language": "string",
      "translation": "string"
    }
  ]
}
```

## Usage

Run the pipeline with the predefined payload:

```bash
npm run run-task
```

This will trigger the `research-pipeline` task with:
- Topic: "Artificial Intelligence"
- Languages: ["Spanish", "French", "German"]

The script will output the Run ID of the triggered task.

## Configuration

The project uses the following environment variables:
- `TRIGGER_PROJECT_REF`: Your Trigger.dev project reference
- `TRIGGER_CREDENTIAL_CONFIG_JSON`: Your Trigger.dev credentials configuration

## Orchestration Features

This project demonstrates:
- Sequential task execution using `client.triggerAndWait`
- Parallel task execution using `client.batchTriggerAndWait`
- Error handling and result aggregation
- Durable execution with automatic retries