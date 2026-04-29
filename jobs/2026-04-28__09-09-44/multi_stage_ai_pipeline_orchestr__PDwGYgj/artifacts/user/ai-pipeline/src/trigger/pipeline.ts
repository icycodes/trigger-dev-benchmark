import { batchTriggerAndWait, task } from "@trigger.dev/sdk";

const trialId = "multi_stage_ai_pipeline_orchestr__PDwGYgj";

type GenerateSummaryPayload = {
  topic: string;
};

type TranslateSummaryPayload = {
  text: string;
  language: string;
};

type ResearchPipelinePayload = {
  topic: string;
  languages: string[];
};

const buildSummary = (topic: string): string => {
  const baseSummary = `${topic} shapes modern research by combining data, computation, and human insight. It spans machine learning, natural language processing, computer vision, and robotics while drawing from statistics, cognitive science, and engineering. Researchers train models to recognize patterns, predict outcomes, and assist decision making. Progress depends on high quality data, scalable infrastructure, and careful evaluation against bias and misuse. Ethical considerations include transparency, accountability, privacy, and the societal impact of automation. The field advances through open benchmarks, interdisciplinary collaboration, and responsible deployment practices that prioritize safety, fairness, and long term trust.`;
  const words = baseSummary.trim().split(/\s+/);
  return words.slice(0, 100).join(" ");
};

export const generateSummary = task({
  id: `generate-summary-${trialId}`,
  run: async (payload: GenerateSummaryPayload) => buildSummary(payload.topic),
});

export const translateSummary = task({
  id: `translate-summary-${trialId}`,
  run: async (payload: TranslateSummaryPayload) => ({
    language: payload.language,
    translation: `[${payload.language}] ${payload.text}`,
  }),
});

export const researchPipeline = task({
  id: `research-pipeline-${trialId}`,
  run: async (payload: ResearchPipelinePayload) => {
    const summaryResult = await generateSummary.triggerAndWait({
      topic: payload.topic,
    });
    const summary =
      typeof summaryResult === "object" && summaryResult !== null && "output" in summaryResult
        ? summaryResult.output
        : summaryResult;

    const translationResults = await batchTriggerAndWait(
      payload.languages.map((language) => ({
        task: translateSummary,
        payload: {
          text: summary,
          language,
        },
      }))
    );

    const translations = translationResults.map((result) =>
      typeof result === "object" && result !== null && "output" in result ? result.output : result
    );

    return {
      topic: payload.topic,
      summary,
      translations,
    };
  },
});
