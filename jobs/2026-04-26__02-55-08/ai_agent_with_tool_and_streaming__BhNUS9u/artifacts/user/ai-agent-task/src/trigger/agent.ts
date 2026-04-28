import { schemaTask, ai, streams } from "@trigger.dev/sdk";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTask } from "./weather";
import fs from "fs";

const trial_id = fs.existsSync("/logs/trial_id")
  ? fs.readFileSync("/logs/trial_id", "utf-8").trim()
  : "default";

export const agentTask = schemaTask({
  id: `agentTask-${trial_id}`,
  schema: z.object({
    city: z.string(),
  }),
  run: async (payload) => {
    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      tools: {
        weather: ai.tool(weatherTask),
      },
      prompt: `What is the weather in ${payload.city} and what should I wear?`,
    });

    const stream = streams.define({ id: "ai-output" });
    const result = await stream.pipe(textStream);
    await result.waitUntilComplete();
  },
});
