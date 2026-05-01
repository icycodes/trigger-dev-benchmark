import { schemaTask, streams } from "@trigger.dev/sdk";
import { tool, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { weatherTask } from "./weather";

const TRIAL_ID = "ai_agent_with_tool_and_streaming__y28vu4z";

const aiOutputStream = streams.define({ id: "ai-output" });

export const agentTask = schemaTask({
  id: `agentTask-${TRIAL_ID}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    const weatherTool = tool(weatherTask);

    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful assistant that recommends clothing based on the weather.",
      prompt: `Use the weather tool to get the weather in ${city} and recommend clothing based on it.`,
      tools: {
        weather: weatherTool,
      },
      toolChoice: "auto",
    });

    const pipe = textStream.pipe(aiOutputStream);
    await pipe.waitUntilComplete();

    return { status: "completed" };
  },
});
