import { task } from "@trigger.dev/sdk";

const trial_id = "multi_stage_ai_pipeline_orchestr__rkYwWsg";

export const generateSummary = task({
  id: `generate-summary-${trial_id}`,
  run: async (payload: { topic: string }) => {
    return `This is a 100-word summary about ${payload.topic}. ` + "word ".repeat(90);
  },
});

export const translateSummary = task({
  id: `translate-summary-${trial_id}`,
  run: async (payload: { text: string; language: string }) => {
    return {
      language: payload.language,
      translation: `Translated [${payload.text}] to ${payload.language}`,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${trial_id}`,
  run: async (payload: { topic: string; languages: string[] }) => {
    // Stage 1
    const summaryResult = await generateSummary.triggerAndWait({ topic: payload.topic });
    
    if (!summaryResult.ok) {
      throw new Error(`Failed to generate summary: ${(summaryResult as any).error}`);
    }
    
    const summary = summaryResult.output;

    // Stage 2
    const items = payload.languages.map((lang) => ({
      payload: { text: summary, language: lang },
    }));
    
    const translationsResult = await translateSummary.batchTriggerAndWait(items);

    // Stage 3
    const translations = translationsResult.runs.map((r) => {
      if (r.ok) {
         return r.output;
      }
      return { language: "error", translation: "error" };
    });

    return {
      original: summary,
      translations,
    };
  },
});
