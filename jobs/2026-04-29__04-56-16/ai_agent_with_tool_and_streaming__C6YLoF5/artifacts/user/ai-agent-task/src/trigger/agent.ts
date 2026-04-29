import { schemaTask, streams } from "@trigger.dev/sdk";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { readFileSync } from "fs";
import { z } from "zod";

import { weatherTask } from "./weather";

const trialId = readFileSync("/logs/trial_id", "utf8").trim();

export const agentTask = schemaTask({
  id: `agentTask-${trialId}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async ({ city }) => {
    const weatherTool = tool(weatherTask);
    const aiOutput = streams.define({ id: "ai-output" });

    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: weatherTool,
      },
      system: "You are a helpful assistant that recommends clothing based on weather.",
      prompt: `Use the weather tool for ${city} and recommend what to wear.`,
    });

    const pipe = aiOutput.pipe(textStream);
    await pipe.waitUntilComplete();

    return { status: "completed" };
  },
});
