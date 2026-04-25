import { task } from "@trigger.dev/sdk/v3";

const trialId = "multi_stage_ai_pipeline_orchestr__t8PtEdD";

export const generateSummaryTask = task({
  id: `generate-summary-${trialId}`,
  run: async (payload: { topic: string }) => {
    return `This is a 100-word summary about ${payload.topic}.`;
  },
});

export const translateSummaryTask = task({
  id: `translate-summary-${trialId}`,
  run: async (payload: { text: string; language: string }) => {
    return {
      language: payload.language,
      translation: `[${payload.language}] ${payload.text}`,
    };
  },
});

export const researchPipelineTask = task({
  id: `research-pipeline-${trialId}`,
  run: async (payload: { topic: string; languages: string[] }) => {
    // Stage 1: Generate summary
    const summary = await generateSummaryTask.triggerAndWait({
      topic: payload.topic,
    }).unwrap();

    // Stage 2: Translate summary (parallel)
    const translationResults = await translateSummaryTask.batchTriggerAndWait(
      payload.languages.map((language) => ({
        payload: {
          text: summary,
          language,
        },
      }))
    );

    // Stage 3: Aggregation
    const translations = translationResults.runs.map((run) => {
        if (run.ok) {
            return run.output;
        }
        return { language: "unknown", translation: "failed" };
    });

    return {
      topic: payload.topic,
      originalSummary: summary,
      translations,
    };
  },
});
