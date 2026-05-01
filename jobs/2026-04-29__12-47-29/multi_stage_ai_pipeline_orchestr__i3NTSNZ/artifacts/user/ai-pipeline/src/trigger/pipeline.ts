import { task } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__i3NTSNZ";

export const generateSummary = task({
  id: `generate-summary-${TRIAL_ID}`,
  run: async (payload: { topic: string }) => {
    // Mock summary generation
    return `This is a 100-word summary about ${payload.topic}. It covers the main points and provides a comprehensive overview of the subject.`;
  },
});

export const translateSummary = task({
  id: `translate-summary-${TRIAL_ID}`,
  run: async (payload: { text: string; language: string }) => {
    // Mock translation
    return {
      language: payload.language,
      translation: `[Translated to ${payload.language}] ${payload.text}`,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${TRIAL_ID}`,
  run: async (payload: { topic: string; languages: string[] }) => {
    // Stage 1: Trigger summary generation and wait
    const summaryResult = await generateSummary.triggerAndWait({
      topic: payload.topic,
    });
    
    if (!summaryResult.ok) {
      throw new Error("Summary generation failed");
    }
    
    const summary = summaryResult.output;

    // Stage 2: Trigger multiple translations in parallel and wait
    const translationPayloads = payload.languages.map((language) => ({
      payload: {
        text: summary,
        language,
      },
    }));

    const translationResults = await translateSummary.batchTriggerAndWait(translationPayloads);
    
    const translations = translationResults.runs.map((res) => {
      if (res.ok) {
        return res.output;
      }
      throw new Error("Translation failed");
    });

    // Stage 3: Aggregate
    return {
      summary,
      translations,
    };
  },
});
