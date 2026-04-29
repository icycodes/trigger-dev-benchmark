import { schemaTask, streams, ai } from "@trigger.dev/sdk";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTask } from "./weather";

const trial_id = "ai_agent_with_tool_and_streaming__8zP85sX";

export const agentTask = schemaTask({
  id: `agentTask-${trial_id}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      prompt: `What should I wear in ${payload.city} today based on the weather?`,
      tools: {
        getWeather: ai.tool(weatherTask, {
          description: "Get the weather for a city",
        }),
      },
    });

    const outputStream = streams.define({ id: "ai-output" });
    const result = await outputStream.pipe(textStream);
    await result.waitUntilComplete();

    return { success: true };
  },
});
