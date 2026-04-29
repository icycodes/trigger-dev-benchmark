import { schemaTask, streams } from "@trigger.dev/sdk";
import { z } from "zod";
import { streamText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { weatherTask } from "./weather";
import { ai } from "@trigger.dev/sdk/ai";

export const agentTask = schemaTask({
  id: "agentTask-ai_agent_with_tool_and_streaming__4XzRy55",
  maxDuration: 300,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const weatherTool = ai.tool(weatherTask);

    const result = streamText({
      model: openai("gpt-4o"),
      prompt: `What should I wear today in ${payload.city}? Use the weather tool to find out the weather first.`,
      tools: {
        weather: weatherTool,
      },
      stopWhen: stepCountIs(5),
    });

    const stream = streams.define({ id: "ai-output" });
    const pipeResult = stream.pipe(result.textStream);

    await pipeResult.waitUntilComplete();

    return { success: true };
  },
});
