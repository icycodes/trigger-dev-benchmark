import { task } from "@trigger.dev/sdk/v3";

// Trial ID suffix for all task IDs
const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__ta4GBHq";

// Task IDs using trial_id as suffix
const GENERATE_SUMMARY_TASK_ID = `generate-summary-${TRIAL_ID}`;
const TRANSLATE_SUMMARY_TASK_ID = `translate-summary-${TRIAL_ID}`;
const RESEARCH_PIPELINE_TASK_ID = `research-pipeline-${TRIAL_ID}`;

// Stage 1: Generate a 100-word summary of the topic
export const generateSummary = task({
  id: GENERATE_SUMMARY_TASK_ID,
  run: async (payload: { topic: string }): Promise<{ summary: string }> => {
    const { topic } = payload;

    // Mock summary generation: produce a ~100-word summary
    const summary =
      `${topic} is a transformative field of computer science that enables machines to simulate human intelligence. ` +
      `It encompasses machine learning, neural networks, natural language processing, and computer vision. ` +
      `AI systems learn from vast datasets, identify patterns, and make decisions with minimal human intervention. ` +
      `Applications range from healthcare diagnostics and autonomous vehicles to virtual assistants and financial forecasting. ` +
      `While AI offers tremendous benefits—boosting productivity, accelerating research, and solving complex problems—it also raises ` +
      `ethical concerns around bias, privacy, and job displacement. ` +
      `Responsible development and governance are essential to harness AI's potential while mitigating its risks for society.`;

    return { summary };
  },
});

// Stage 2: Translate a summary into a target language
export const translateSummary = task({
  id: TRANSLATE_SUMMARY_TASK_ID,
  run: async (payload: {
    text: string;
    language: string;
  }): Promise<{ language: string; translation: string }> => {
    const { text, language } = payload;

    // Mock translation: prefix the text with a language marker
    const translation = `[${language} Translation] ${text}`;

    return { language, translation };
  },
});

// Orchestrator: Parent task that runs the full research pipeline
export const researchPipeline = task({
  id: RESEARCH_PIPELINE_TASK_ID,
  run: async (payload: {
    topic: string;
    languages: string[];
  }): Promise<{
    topic: string;
    originalSummary: string;
    translations: { language: string; translation: string }[];
  }> => {
    const { topic, languages } = payload;

    // Stage 1 (Sequential): Generate summary using triggerAndWait
    const summaryResult = await generateSummary.triggerAndWait({ topic });

    if (!summaryResult.ok) {
      throw new Error(`Summary generation failed: ${summaryResult.error}`);
    }

    const originalSummary = summaryResult.output.summary;

    // Stage 2 (Parallel): Translate the summary into all languages using batchTriggerAndWait
    const translationItems = languages.map((language) => ({
      payload: {
        text: originalSummary,
        language,
      },
    }));

    const translationResults =
      await translateSummary.batchTriggerAndWait(translationItems);

    // Stage 3 (Aggregation): Collect all successful translations
    const translations: { language: string; translation: string }[] = [];

    for (const result of translationResults.runs) {
      if (result.ok) {
        translations.push(result.output);
      } else {
        console.warn(`Translation failed for a language: ${result.error}`);
      }
    }

    // Return the final aggregated report
    return {
      topic,
      originalSummary,
      translations,
    };
  },
});
