import { ai, schemaTask, streams } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { weatherTask } from "./weather";

const trialId = "ai_agent_with_tool_and_streaming__GksfxtV";

const aiOutput = streams.define({ id: "ai-output" });

export const agentTask = schemaTask({
  id: `agentTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    const weatherTool = ai.tool(weatherTask);

    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      prompt: `Use the weather tool to check the weather in ${city} and recommend appropriate clothing.`,
    });

    const { waitUntilComplete } = aiOutput.pipe(textStream);
    await waitUntilComplete();

    return { streamed: true };
  },
});
