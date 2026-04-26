import { schemaTask, streams, ai } from "@trigger.dev/sdk";
import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { weatherTask } from "./weather";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__ZbC7ga3";

export const agentTask = schemaTask({
  id: `agentTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    // Create a tool from the weather task
    const weatherTool = ai.tool(weatherTask);

    // Use streamText with the weather tool
    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      prompt: `What should I wear in ${city}? Consider the weather conditions.`,
      maxSteps: 5,
    });

    // Pipe the textStream to the Trigger.dev stream with key "ai-output"
    const { waitUntilComplete } = await streams.pipe("ai-output", result.textStream);

    // Wait for complete
    await waitUntilComplete();

    return {
      success: true,
      city,
    };
  },
});