import { schemaTask, streams, ai } from "@trigger.dev/sdk";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTask } from "./weather";

const trial_id = "ai_agent_with_tool_and_streaming__6ANSN3z";

export const agentTask = schemaTask({
  id: `agentTask-${trial_id}`,
  schema: {
    input: z.object({
      city: z.string(),
    }),
    output: z.object({
      response: z.string(),
    }),
  },
  run: async ({ input, ctx }) => {
    // Create a stream for AI output
    const aiStream = streams.define({ id: "ai-output" });

    // Convert the weather task to an AI tool
    const weatherTool = ai.tool(weatherTask);

    // Use streamText with OpenAI and the weather tool
    const result = streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      prompt: `Based on the weather in ${input.city}, recommend what clothing I should wear today.`,
    });

    // Pipe the text stream to our defined stream
    await aiStream.pipe(result.textStream);

    // Wait for the stream to complete
    await aiStream.waitUntilComplete();

    // Get the final response
    const { text } = await result;

    return {
      response: text,
    };
  },
});