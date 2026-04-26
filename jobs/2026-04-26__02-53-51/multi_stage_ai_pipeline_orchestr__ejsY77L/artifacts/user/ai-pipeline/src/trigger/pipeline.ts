import { client, task } from "@trigger.dev/sdk/v3";

// Configure the client
client.init({
  id: "ai-pipeline",
});

// Trial ID for task suffixes
const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__ejsY77L";

// Task 1: Generate Summary
export const generateSummaryTask = task({
  id: `generate-summary-${TRIAL_ID}`,
  run: async ({ topic }: { topic: string }) => {
    // Mock summary generation - returns a 100-word summary
    const summary = `This is a comprehensive summary about ${topic}. The topic encompasses various aspects including historical context, current developments, and future implications. Research indicates significant progress in this area with numerous applications across different domains. Experts suggest continued growth and innovation in the coming years. The field has attracted substantial attention from both academia and industry, leading to collaborative efforts and breakthrough discoveries. Key challenges remain, but ongoing research addresses these issues systematically. The impact extends beyond theoretical understanding to practical implementations that benefit society. Stakeholders from various sectors contribute to the ecosystem, creating a dynamic and evolving landscape. Future directions point toward enhanced capabilities and broader adoption. This summary provides an overview of the essential elements and current state of ${topic}.`;

    return summary;
  },
});

// Task 2: Translate Summary
export const translateSummaryTask = task({
  id: `translate-summary-${TRIAL_ID}`,
  run: async ({ text, language }: { text: string; language: string }) => {
    // Mock translation - returns the translated text with language indicator
    const translation = `[${language.toUpperCase()}] ${text}`;

    return {
      language,
      translation,
    };
  },
});

// Task 3: Research Pipeline (Orchestrator)
export const researchPipelineTask = task({
  id: `research-pipeline-${TRIAL_ID}`,
  run: async ({ topic, languages }: { topic: string; languages: string[] }) => {
    // Stage 1: Sequential - Generate summary
    const summaryResult = await generateSummaryTask.triggerAndWait({
      topic,
    });

    const summary = summaryResult.output;

    // Stage 2: Parallel - Translate summary to all languages using batchTriggerAndWait
    const translationResults = await translateSummaryTask.batchTriggerAndWait(
      languages.map((language) => ({
        payload: {
          text: summary,
          language,
        },
      }))
    );

    // Stage 3: Aggregation - Combine all results into final report
    const translations = translationResults.outputs.map((result) => ({
      language: result.language,
      translation: result.translation,
    }));

    const finalReport = {
      topic,
      originalSummary: summary,
      translations,
      translationCount: translations.length,
      generatedAt: new Date().toISOString(),
    };

    return finalReport;
  },
});