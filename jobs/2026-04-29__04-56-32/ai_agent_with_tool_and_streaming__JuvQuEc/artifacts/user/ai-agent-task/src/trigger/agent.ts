import { schemaTask, streams } from "@trigger.dev/sdk/v3";
import { ai } from "@trigger.dev/sdk/ai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { weatherTask } from "./weather.js";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__JuvQuEc";

const aiOutputStream = streams.define<string>({ id: "ai-output" });

export const agentTask = schemaTask({
  id: `agentTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    const weatherTool = ai.tool(weatherTask);

    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      maxSteps: 5,
      messages: [
        {
          role: "user",
          content: `What should I wear today in ${city}? Use the weather tool to check the current weather first, then give a clothing recommendation.`,
        },
      ],
    });

    const { waitUntilComplete } = await aiOutputStream.pipe(result.textStream);

    await waitUntilComplete();
  },
});
