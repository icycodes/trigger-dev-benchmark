import { task } from "@trigger.dev/sdk";

const trialId = "multi_stage_ai_pipeline_orchestr__BZ6oey6";

export const generateSummary = task({
  id: `generate-summary-${trialId}`,
  run: async (payload: { topic: string }) => {
    return `This is a 100-word summary of ${payload.topic}. It covers the main aspects and provides a concise overview of the subject matter, ensuring that the reader understands the core concepts without needing to delve into extensive detail. The summary is designed to be informative and engaging, highlighting the key takeaways and significance of the topic in a clear and professional manner.`;
  },
});

export const translateSummary = task({
  id: `translate-summary-${trialId}`,
  run: async (payload: { text: string; language: string }) => {
    // Mock translation
    return {
      language: payload.language,
      translation: `[${payload.language}] ${payload.text}`,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${trialId}`,
  run: async (payload: { topic: string; languages: string[] }) => {
    // Stage 1: Sequential summary generation
    const summary = await generateSummary.triggerAndWait({ topic: payload.topic });

    if (!summary.ok) {
      throw new Error(`Summary generation failed: ${summary.error}`);
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
        return { error: run.error };
      }),
    };

    return finalReport;
  },
});
