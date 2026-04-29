import { schemaTask, ai, streams } from "@trigger.dev/sdk";
import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { weatherTask } from "./weather";

const trialId = "ai_agent_with_tool_and_streaming__YQNayN2";

export const agentTask = schemaTask({
  id: `agentTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    console.log(`Agent task started for city: ${city}`);

    // Convert the weather task into a Vercel AI SDK tool
    const weatherTool = ai.tool(weatherTask);

    // Define the stream for AI output
    const aiOutput = streams.define({
      id: "ai-output",
    });

    // Use streamText with the weather tool
    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      prompt: `Based on the weather in ${city}, provide a clothing recommendation. First check the weather using the weather tool, then give specific clothing suggestions.`,
    });

    // Pipe the textStream to the defined stream
    const pipeResult = aiOutput.pipe(result.textStream);

    // Wait until the stream is complete
    await pipeResult.waitUntilComplete();

    return {
      recommendation: "Clothing recommendation based on weather",
    };
  },
});