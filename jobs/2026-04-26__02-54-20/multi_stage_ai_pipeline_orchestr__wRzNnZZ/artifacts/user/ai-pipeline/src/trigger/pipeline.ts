import { task } from "@trigger.dev/sdk/v3";

const TRIAL_ID = "multi_stage_ai_pipeline_orchestr__wRzNnZZ";

// Stage 1: Generate a mock 100-word summary of a given topic
export const generateSummary = task({
  id: `generate-summary-${TRIAL_ID}`,
  async run(payload: { topic: string }) {
    const summary = `${payload.topic} is a transformative field of computer science focused on creating intelligent systems 
    capable of performing tasks that typically require human intelligence. It encompasses machine learning, 
    natural language processing, computer vision, and robotics. AI systems learn from vast datasets to recognize 
    patterns, make decisions, and improve over time. Applications range from virtual assistants and recommendation 
    engines to autonomous vehicles and medical diagnostics. While AI offers enormous potential to boost productivity 
    and solve complex problems, it also raises important ethical considerations around bias, privacy, and employment. 
    Responsible development and governance frameworks are essential to ensure AI benefits humanity broadly and equitably.`;

    return { summary };
  },
});

// Stage 2: Translate the summary into a given language (mocked)
export const translateSummary = task({
  id: `translate-summary-${TRIAL_ID}`,
  async run(payload: { text: string; language: string }) {
    const { text, language } = payload;

    // Mock translation by prefixing the text with the language name
    const translation = `[${language} translation]: ${text}`;

    return { language, translation };
  },
});

// Orchestrator: The parent pipeline task
export const researchPipeline = task({
  id: `research-pipeline-${TRIAL_ID}`,
  async run(payload: { topic: string; languages: string[] }) {
    const { topic, languages } = payload;

    // Stage 1 (Sequential): Generate a summary using triggerAndWait
    const summaryResult = await generateSummary.triggerAndWait({ topic });

    if (!summaryResult.ok) {
      throw new Error(`generate-summary task failed: ${summaryResult.error}`);
    }

    const { summary } = summaryResult.output;

    // Stage 2 (Parallel): Translate the summary into all requested languages using batchTriggerAndWait
    const translationResults = await translateSummary.batchTriggerAndWait(
      languages.map((language) => ({
        payload: { text: summary, language },
      }))
    );

    // Stage 3 (Aggregation): Collect all translations into a final report
    const translations: Record<string, string> = {};

    for (const result of translationResults.runs) {
      if (result.ok) {
        const { language, translation } = result.output;
        translations[language] = translation;
      } else {
        console.warn(`Translation failed for one language: ${result.error}`);
      }
    }

    const report = {
      topic,
      originalSummary: summary,
      translations,
    };

    console.log("Final Report:", JSON.stringify(report, null, 2));

    return report;
  },
});
