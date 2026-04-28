import { schemaTask, streams } from "@trigger.dev/sdk/v3";
import { ai } from "@trigger.dev/sdk/ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { weatherTask } from "./weather";

const trialId = "ai_agent_with_tool_and_streaming__eNsgM8r";

export const agentTask = schemaTask({
  id: `agentTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    // Create a Vercel AI SDK tool from the weather Trigger.dev task
    const weatherTool = ai.tool(weatherTask);

    // Define a named stream for the AI output
    const aiOutputStream = streams.define<string>({ id: "ai-output" });

    // Use streamText with the weather tool to generate a clothing recommendation
    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        getWeather: weatherTool,
      },
      maxSteps: 5,
      prompt: `What should I wear today in ${payload.city}? Use the getWeather tool to check the weather first, then provide a clothing recommendation.`,
    });

    // Pipe the text stream to the defined stream
    const { waitUntilComplete } = aiOutputStream.pipe(result.textStream);

    // Wait for the stream to complete
    await waitUntilComplete();

    return { city: payload.city };
  },
});
