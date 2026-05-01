import { schemaTask, streams } from "@trigger.dev/sdk";
import { ai } from "@trigger.dev/sdk/ai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { weatherTask } from "./weather.js";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__B7MqwXh";

export const agentTask = schemaTask({
  id: `agentTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const { city } = payload;

    // Create the weather tool from the weatherTask
    const weatherTool = ai.tool(weatherTask);

    // Use streamText from Vercel AI SDK with the weather tool
    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      maxSteps: 5,
      prompt: `What is the weather in ${city}? Based on the weather, recommend what clothing to wear today.`,
    });

    // Define a named stream
    const aiOutputStream = streams.define<string>({ id: "ai-output" });

    // Pipe the textStream to the defined stream
    const { waitUntilComplete } = aiOutputStream.pipe(result.textStream);

    // Wait for the stream to complete
    await waitUntilComplete();
  },
});
