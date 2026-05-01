import { schemaTask, streams } from "@trigger.dev/sdk";
import { ai } from "@trigger.dev/sdk/ai";
import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { weatherTask } from "./weather";

export const agentTask = schemaTask({
  id: "agentTask-ai_agent_with_tool_and_streaming__iXi6w83",
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const weatherTool = ai.tool(weatherTask);
    const stream = streams.define({ id: "ai-output" });

    const result = streamText({
      model: openai("gpt-4o"),
      tools: { weather: weatherTool },
      prompt: `Based on the weather in ${payload.city}, what clothing do you recommend?`,
    });

    const { waitUntilComplete } = stream.pipe(result.textStream);

    await waitUntilComplete();

    return { success: true };
  },
});
