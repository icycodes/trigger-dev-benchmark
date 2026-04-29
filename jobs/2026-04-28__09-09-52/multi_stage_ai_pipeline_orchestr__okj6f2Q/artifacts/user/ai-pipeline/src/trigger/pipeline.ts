import { client, task } from "@trigger.dev/sdk";

const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__okj6f2Q";

interface GenerateSummaryPayload {
  topic: string;
}

interface TranslateSummaryPayload {
  text: string;
  language: string;
}

interface TranslateSummaryResult {
  language: string;
  translation: string;
}

interface ResearchPipelinePayload {
  topic: string;
  languages: string[];
}

interface ResearchPipelineResult {
  originalSummary: string;
  translations: TranslateSummaryResult[];
}

export const generateSummary = task({
  id: `generate-summary-${TRIAL_ID}`,
  run: async (payload: GenerateSummaryPayload) => {
    // Mock summary generation - create a 100-word summary
    const summary = `${payload.topic} represents a significant advancement in modern technology. This field encompasses various methodologies and approaches that have revolutionized how we approach complex problems. Researchers and practitioners continue to explore innovative solutions, pushing the boundaries of what is possible. The impact extends across multiple industries, transforming traditional processes and creating new opportunities for growth and development.`;

    return summary;
  },
});

export const translateSummary = task({
  id: `translate-summary-${TRIAL_ID}`,
  run: async (payload: TranslateSummaryPayload): Promise<TranslateSummaryResult> => {
    // Mock translation - in a real implementation, this would call a translation API
    const translations: Record<string, string> = {
      Spanish: `Esta es una traducción simulada al español para: ${payload.text.substring(0, 20)}...`,
      French: `Ceci est une traduction simulée en français pour: ${payload.text.substring(0, 20)}...`,
      German: `Dies ist eine simulierte deutsche Übersetzung für: ${payload.text.substring(0, 20)}...`,
      Italian: `Questa è una traduzione simulata in italiano per: ${payload.text.substring(0, 20)}...`,
      Portuguese: `Esta é uma tradução simulada em português para: ${payload.text.substring(0, 20)}...`,
    };

    const translation = translations[payload.language] || `Translation to ${payload.language}: ${payload.text.substring(0, 20)}...`;

    return {
      language: payload.language,
      translation,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${TRIAL_ID}`,
  run: async (payload: ResearchPipelinePayload, { ctx }) => {
    // Stage 1: Sequential - Generate summary
    const summaryResult = await client.triggerAndWait<typeof generateSummary>(
      ctx,
      generateSummary.id,
      {
        topic: payload.topic,
      }
    );

    if (!summaryResult.ok) {
      throw new Error(`Failed to generate summary: ${summaryResult.error}`);
    }

    const originalSummary = summaryResult.output;

    // Stage 2: Parallel - Translate summary to all languages
    const translationResults = await client.batchTriggerAndWait<typeof translateSummary>(
      ctx,
      payload.languages.map((language) => ({
        id: translateSummary.id,
        payload: {
          text: originalSummary,
          language,
        },
      }))
    );

    const translations: TranslateSummaryResult[] = [];

    for (const result of translationResults.results) {
      if (result.ok) {
        translations.push(result.output);
      } else {
        console.error(`Failed to translate: ${result.error}`);
      }
    }

    // Stage 3: Aggregation - Create final report
    const finalReport: ResearchPipelineResult = {
      originalSummary,
      translations,
    };

    return finalReport;
  },
});