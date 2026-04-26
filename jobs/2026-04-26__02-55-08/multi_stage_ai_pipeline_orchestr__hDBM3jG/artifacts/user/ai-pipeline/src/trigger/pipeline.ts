import { task } from "@trigger.dev/sdk";

const trial_id = "multi_stage_ai_pipeline_orchestr__hDBM3jG";

export const generateSummary = task({
  id: `generate-summary-${trial_id}`,
  run: async (payload: { topic: string }) => {
    return `This is a 100-word summary about ${payload.topic}. It covers the main aspects and provides a concise overview of the subject matter.`;
  },
});

export const translateSummary = task({
  id: `translate-summary-${trial_id}`,
  run: async (payload: { text: string; language: string }) => {
    return {
      language: payload.language,
      translation: `[Translated to ${payload.language}]: ${payload.text}`,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${trial_id}`,
  run: async (payload: { topic: string; languages: string[] }) => {
    // Stage 1: Sequential summary generation
    const summary = await generateSummary.triggerAndWait({ topic: payload.topic });

    if (!summary.ok) {
        throw new Error("Summary generation failed");
    }

    // Stage 2: Parallel translation
    const translations = await translateSummary.batchTriggerAndWait(
      payload.languages.map((lang) => ({
        payload: { text: summary.output, language: lang },
      }))
    );

    // Stage 3: Aggregation
    const finalReport = {
      topic: payload.topic,
      originalSummary: summary.output,
      translations: translations.runs.map((run) => {
          if (run.ok) {
              return run.output;
          }
          return { language: "Unknown", translation: "Translation failed" };
      }),
    };

    return finalReport;
  },
});
