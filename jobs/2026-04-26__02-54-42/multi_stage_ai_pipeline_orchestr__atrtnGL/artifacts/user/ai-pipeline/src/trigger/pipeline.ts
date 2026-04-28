import { batchTriggerAndWait, task } from "@trigger.dev/sdk";

const trialId = "multi_stage_ai_pipeline_orchestr__atrtnGL";

type SummaryPayload = {
  topic: string;
};

type TranslationPayload = {
  text: string;
  language: string;
};

type PipelinePayload = {
  topic: string;
  languages: string[];
};

export const generateSummary = task({
  id: `generate-summary-${trialId}`,
  run: async (payload: SummaryPayload) => {
    const { topic } = payload;

    return [
      `This summary introduces ${topic} as a fast-moving field that blends computation, data, and human goals to build`,
      "systems capable of reasoning, perception, and decision-making. It outlines how modern approaches combine large-scale",
      "machine learning with symbolic methods, and notes the importance of data quality, evaluation, and responsible deployment.",
      "The overview highlights real-world applications such as healthcare, finance, and productivity while acknowledging",
      "risks like bias, privacy concerns, and misalignment. It closes by emphasizing the need for interdisciplinary research",
      "and governance so that innovation remains trustworthy, transparent, and beneficial across societies.",
    ].join(" ");
  },
});

export const translateSummary = task({
  id: `translate-summary-${trialId}`,
  run: async (payload: TranslationPayload) => {
    const { text, language } = payload;

    return {
      language,
      translation: `[${language}] ${text}`,
    };
  },
});

export const researchPipeline = task({
  id: `research-pipeline-${trialId}`,
  run: async (payload: PipelinePayload) => {
    const { topic, languages } = payload;

    const summaryRun = await generateSummary.triggerAndWait({
      payload: { topic },
    });

    const summary = summaryRun.output;

    const translationRuns = await batchTriggerAndWait(translateSummary, {
      payloads: languages.map((language) => ({
        text: summary,
        language,
      })),
    });

    return {
      topic,
      summary,
      translations: translationRuns.map((run) => run.output),
    };
  },
});
