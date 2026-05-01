import { schemaTask, ai, streams } from "@trigger.dev/sdk";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTask } from "./weather";

export const agentTask = schemaTask({
  id: "agentTask-ai_agent_with_tool_and_streaming__4aJMy5o",
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const result = await streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: ai.tool(weatherTask),
      },
      prompt: `What should I wear in ${payload.city} today? Use the weather tool to find out the current weather.`,
    });

    const stream = streams.define({ id: "ai-output" });
    const pipeResult = await result.textStream.pipe(stream);
    await pipeResult.waitUntilComplete();

    return { success: true };
  },
});
